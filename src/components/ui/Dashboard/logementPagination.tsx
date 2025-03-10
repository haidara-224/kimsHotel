import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
   
  } from "../pagination"

export function LogementPagination(){
    return <>
    <Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious href="#"/>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">2</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">3</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
    <PaginationItem>
      <PaginationNext href="#"  />
    </PaginationItem>
  </PaginationContent>
</Pagination>

    </>
}