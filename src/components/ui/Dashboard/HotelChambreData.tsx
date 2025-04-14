"use client";
import {
    ColumnDef,
    PaginationState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
import { JSX, useEffect, useState } from "react";
import { Wifi, Tv, Snowflake, CookingPot, BedDouble, Ruler } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../table";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem } from "../pagination";
import { Button } from "../button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../select";
import { usePagination } from "@/src/hooks/use-pagination";
import { Chambres } from "@/types/types";
import { getChambreHotels } from "@/app/(action)/hotel.action";
import { useParams } from "next/navigation";
import Loader from "../Client/Loader";
import Image from "next/image";
const columns: ColumnDef<Chambres>[] = [
    {
        accessorKey: "numero_chambre",
        header: "Numero de la chambre",
        cell: ({ row }) => <div className="font-medium">{row.getValue("numero_chambre")}</div>,
    },
    {
        accessorKey: "price",
        header: "Prix",
        cell: ({ row }) => {
            const price = parseFloat(row.getValue("price"));
            return `${price.toLocaleString()} GNF`;
        },
    },
    {
        accessorKey: "type",
        header: "Type de Chambres",
        cell: ({ row }) => <div className="font-medium">{row.getValue("type")}</div>,
    },
    {
        accessorKey: "capacity",
        header: "Capacity",
        cell: ({ row }) => <div className="font-medium">{row.getValue("capacity")}</div>,
    },
    {
        accessorKey: "disponible",
        header: "Disponible",
        cell: ({ row }) => {
            const dispo = row.getValue("disponible") as boolean;
            return (
                <span className={`px-2 py-1 rounded-full text-white text-xs font-semibold ${dispo ? "bg-green-500" : "bg-red-500"}`}>
                    {dispo ? "Disponible" : "Indisponible"}
                </span>
            );
        },
    },
    {
        id: "reservationsCount",
        header: "Réservations",
        cell: ({ row }) => (row.original.reservation ?? []).length,
    },

    {
        id: "images",
        header: "Images",
        cell: ({ row }) => {
            const images = row.original.images ?? [];

            return (
                <div className="flex gap-1">
                    {images.slice(0, 1).map((img, index) => (
                        
                        
                        <Image
                            key={index}
                            src={img.urlImage}
                            alt={`Image ${index + 1}`}
                            width={50}
                            height={50}
                            className="rounded object-cover border"
                        />
                    ))}
                    {images.length > 3 && (
                        <span className="text-xs text-gray-500">+{images.length - 1} autres</span>
                    )}
                </div>
            );
        },
    },


    {
        id: "equipements",
        header: "Équipements",
        cell: ({ row }) => {
            const chambre = row.original;

            const features: { icon: JSX.Element; label: string }[] = [
                chambre.hasWifi ? { icon: <Wifi size={16} />, label: "Wifi" } : null,
                chambre.hasTV ? { icon: <Tv size={16} />, label: "TV" } : null,
                chambre.hasClim ? { icon: <Snowflake size={16} />, label: "Clim" } : null,
                chambre.hasKitchen ? { icon: <CookingPot size={16} />, label: "Cuisine" } : null,
                chambre.extraBed ? { icon: <BedDouble size={16} />, label: "Lit supp." } : null,
                chambre.surface ? { icon: <Ruler size={16} />, label: `${chambre.surface} m²` } : null,
            ].filter((f): f is { icon: JSX.Element; label: string } => f !== null); // Filter out null values

            return (
                <div className="flex flex-wrap gap-2 items-center">
                    {features.map((f, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-1 text-sm bg-gray-100 px-2 py-1 rounded shadow-sm"
                        >
                            {f?.icon}
                            <span>{f?.label}</span>
                        </div>
                    ))}
                </div>
            );
        },
    }
];


export default function HotelChambreData() {
    const pageSize = 5;
    const [isLoading, setIsLoading] = useState(false)
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: pageSize,
    });
    const params = useParams();
    const HotelId = Array.isArray(params.hotelId) ? params.hotelId[0] : params.hotelId || "";
    const [sorting, setSorting] = useState<SortingState>([
        {
            id: "numero_chambre",
            desc: false,
        },
    ]);

    const [data, setData] = useState<Chambres[]>([]);
    useEffect(() => {
        try {
            setIsLoading(true)
            async function fetchPosts() {
                const data = await getChambreHotels(HotelId)

                setData(data as unknown as Chambres[]);
            }
            fetchPosts();

        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }


    }, [HotelId]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        enableSortingRemoval: false,
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        state: {
            sorting,
            pagination,
        },
    });

    const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
        currentPage: table.getState().pagination.pageIndex + 1,
        totalPages: table.getPageCount(),
        paginationItemsToDisplay: 5,
    });

    return (
        <div className="space-y-4">
            <div className="overflow-hidden rounded-lg border border-border bg-background">
                {
                    isLoading ? <Loader />
                        : <Table className="table-fixed">
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id} className="hover:bg-transparent">
                                        {headerGroup.headers.map((header) => {
                                            return (
                                                <TableHead
                                                    key={header.id}
                                                    style={{ width: `${header.getSize()}px` }}
                                                    className="h-11"
                                                >
                                                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                                                        <div
                                                            className={cn(
                                                                header.column.getCanSort() &&
                                                                "flex h-full cursor-pointer select-none items-center justify-between gap-2",
                                                            )}
                                                            onClick={header.column.getToggleSortingHandler()}
                                                            onKeyDown={(e) => {
                                                                // Enhanced keyboard handling for sorting
                                                                if (
                                                                    header.column.getCanSort() &&
                                                                    (e.key === "Enter" || e.key === " ")
                                                                ) {
                                                                    e.preventDefault();
                                                                    header.column.getToggleSortingHandler()?.(e);
                                                                }
                                                            }}
                                                            tabIndex={header.column.getCanSort() ? 0 : undefined}
                                                        >
                                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                                            {{
                                                                asc: (
                                                                    <ChevronUp
                                                                        className="shrink-0 opacity-60"
                                                                        size={16}
                                                                        strokeWidth={2}
                                                                        aria-hidden="true"
                                                                    />
                                                                ),
                                                                desc: (
                                                                    <ChevronDown
                                                                        className="shrink-0 opacity-60"
                                                                        size={16}
                                                                        strokeWidth={2}
                                                                        aria-hidden="true"
                                                                    />
                                                                ),
                                                            }[header.column.getIsSorted() as string] ?? null}
                                                        </div>
                                                    ) : (
                                                        flexRender(header.column.columnDef.header, header.getContext())
                                                    )}
                                                </TableHead>
                                            );
                                        })}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id}>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-24 text-center">
                                            No results.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                }
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between gap-3 max-sm:flex-col">
                {/* Page number information */}
                <p className="flex-1 whitespace-nowrap text-sm text-muted-foreground" aria-live="polite">
                    Page <span className="text-foreground">{table.getState().pagination.pageIndex + 1}</span>{" "}
                    of <span className="text-foreground">{table.getPageCount()}</span>
                </p>

                {/* Pagination buttons */}
                <div className="grow">
                    <Pagination>
                        <PaginationContent>
                            {/* Previous page button */}
                            <PaginationItem>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="disabled:pointer-events-none disabled:opacity-50"
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                    aria-label="Go to previous page"
                                >
                                    <ChevronLeft size={16} strokeWidth={2} aria-hidden="true" />
                                </Button>
                            </PaginationItem>

                            {/* Left ellipsis (...) */}
                            {showLeftEllipsis && (
                                <PaginationItem>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            )}

                            {/* Page number buttons */}
                            {pages.map((page) => {
                                const isActive = page === table.getState().pagination.pageIndex + 1;
                                return (
                                    <PaginationItem key={page}>
                                        <Button
                                            size="icon"
                                            variant={`${isActive ? "outline" : "ghost"}`}
                                            onClick={() => table.setPageIndex(page - 1)}
                                            aria-current={isActive ? "page" : undefined}
                                        >
                                            {page}
                                        </Button>
                                    </PaginationItem>
                                );
                            })}

                            {/* Right ellipsis (...) */}
                            {showRightEllipsis && (
                                <PaginationItem>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            )}

                            {/* Next page button */}
                            <PaginationItem>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="disabled:pointer-events-none disabled:opacity-50"
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                    aria-label="Go to next page"
                                >
                                    <ChevronRight size={16} strokeWidth={2} aria-hidden="true" />
                                </Button>
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>

                {/* Results per page */}
                <div className="flex flex-1 justify-end">
                    <Select
                        value={table.getState().pagination.pageSize.toString()}
                        onValueChange={(value) => {
                            table.setPageSize(Number(value));
                        }}
                        aria-label="Results per page"
                    >
                        <SelectTrigger id="results-per-page" className="w-fit whitespace-nowrap">
                            <SelectValue placeholder="Select number of results" />
                        </SelectTrigger>
                        <SelectContent>
                            {[5, 10, 25, 50].map((pageSize) => (
                                <SelectItem key={pageSize} value={pageSize.toString()}>
                                    {pageSize} / page
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

        </div>
    );
}

