import {
    BellIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    PlusIcon,
    SearchIcon,
  } from "lucide-react";
  import React from "react";
  import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "../../components/ui/avatar";
  import { Badge } from "../../components/ui/badge";
  import { Button } from "../../components/ui/button";
  import { Calendar } from "../../components/ui/calendar";
  import { Card, CardContent } from "../../components/ui/card";
  import { Input } from "../../components/ui/input";
  import { Progress } from "../../components/ui/progress";
  
  export const Box = (): JSX.Element => {
    // Navigation items data
    const navItems = [
      { icon: "shield", label: "Occupants", active: true },
      { icon: "paw", label: "Pooch Marketplace" },
      { icon: "receipt", label: "Invoices" },
      { icon: "credit-card", label: "Payments" },
      { icon: "users", label: "Employees" },
      { icon: "calendar", label: "Calendar" },
      { icon: "book", label: "Quickbooks" },
      { icon: "bar-chart", label: "Analytics" },
      { icon: "dollar-sign", label: "Capital" },
      { icon: "shield", label: "Insurance" },
    ];
  
    // Incoming occupants data
    const incomingOccupants = [
      {
        name: "Jonathan D.",
        image: "/jonathan.jpg",
        type: "GROOMING",
        dates: "Feb 12 - Feb 14",
        amount: "$120",
        status: "Unpaid balance: $120",
        needsPaymentLink: true,
      },
      {
        name: "Jessica P.",
        image: "/jessica.jpg",
        type: "DAYCARE",
        dates: "Feb 12 - Feb 14",
        amount: "$130",
        status: "Paid",
        needsPaymentLink: false,
      },
    ];
  
    // Current occupants data
    const currentOccupants = [
      {
        name: "Lilliana M.",
        image: "/lilliana1.jpg",
        type: "GROOMING",
        dates: "Feb 12 - Feb 14",
        amount: "$150",
        status: "Paid",
      },
      {
        name: "Lilliana M.",
        image: "/lilliana2.jpg",
        type: "DAYCARE",
        dates: "Feb 12 - Feb 14",
        amount: "$130",
        status: "Paid",
      },
    ];
  
    // Monthly revenue data
    const revenueData = [
      { month: "Oct 2021", value: 60 },
      { month: "Nov 2021", value: 70 },
      { month: "Dec 2021", value: 90 },
      { month: "Jan 2022", value: 80 },
      { month: "Feb 2022", value: 85 },
    ];
  
    // Calendar events
    const calendarEvents = [
      { title: 'Meeting', start: new Date().toISOString().split('T')[0] },
      { title: 'Grooming', start: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0] },
    ];
  
    const handleDateSelect = (arg: any) => {
      console.log('Date selected:', arg.startStr);
    };
  
    const handleEventClick = (arg: any) => {
      console.log('Event clicked:', arg.event.title);
    };
  
    return (
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <div className="w-64 bg-white p-6 flex flex-col border-r">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">GroomFolio</h1>
          </div>
  
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm font-medium">LISTING</span>
            <div className="flex items-center">
              <div className="w-10 h-5 bg-green-3 rounded-full relative flex items-center p-1">
                <div className="w-3 h-3 bg-white rounded-full absolute right-1"></div>
              </div>
              <span className="ml-2 text-sm">On</span>
            </div>
          </div>
  
          <nav className="space-y-1 flex-1">
            {navItems.map((item, index) => (
              <div
                key={index}
                className={`flex items-center p-3 rounded-md ${item.active ? "bg-teal-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}
              >
                <div className="w-5 h-5 mr-3 flex items-center justify-center">
                  {/* Simplified icon representation */}
                  <div
                    className={`w-4 h-4 ${item.active ? "text-white" : "text-teal-600"}`}
                  ></div>
                </div>
                <span>{item.label}</span>
              </div>
            ))}
          </nav>
        </div>
  
        {/* Main content */}
        <div className="flex-1 flex">
          {/* Middle section */}
          <div className="flex-1 p-6 border-r">
            {/* Header with business info */}
            <div className="flex items-center mb-8">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src="/marina-pet-spa.jpg" alt="Marina Pet Spa" />
                <AvatarFallback>MS</AvatarFallback>
              </Avatar>
              <span className="font-medium">Marina Pet Spa</span>
  
              <div className="ml-auto flex items-center">
                <div className="relative mr-4">
                  <Input
                    className="pl-9 pr-4 py-2 rounded-full bg-gray-50 border-gray-200"
                    placeholder="Search"
                  />
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
  
                <div className="relative mr-4">
                  <BellIcon className="w-5 h-5 text-gray-500" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full text-white text-xs flex items-center justify-center">
                    1
                  </span>
                </div>
  
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src="/admin-avatar.jpg" alt="Administrator" />
                    <AvatarFallback>A</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium">Administrator</div>
                    <div className="text-xs text-gray-500">ID: 123456</div>
                  </div>
                </div>
              </div>
            </div>
  
            {/* Hotel Occupants section */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium text-gray-800">
                  Hotel Occupants
                </h2>
                <Button className="bg-teal-500 hover:bg-teal-600 text-white rounded-full">
                  <PlusIcon className="w-4 h-4 mr-1" />
                  ADD OCCUPANTS
                </Button>
              </div>
  
              <div className="relative mb-6">
                <Input
                  className="w-full pl-3 pr-10 py-2 border-gray-200"
                  placeholder="Search hotel occupants"
                />
                <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
  
            {/* Incoming occupants section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Incoming occupants</h3>
                <div className="flex">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <ChevronLeftIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <ChevronRightIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
  
              <div className="grid grid-cols-2 gap-4">
                {incomingOccupants.map((occupant, index) => (
                  <Card key={index} className="overflow-hidden bg-white">
                    <CardContent className="p-0">
                      <div
                        className={`p-4 ${occupant.needsPaymentLink ? "bg-teal-400" : "bg-white"} flex flex-col items-center`}
                      >
                        <Avatar className="h-16 w-16 mb-2">
                          <AvatarImage src={occupant.image} alt={occupant.name} />
                          <AvatarFallback>
                            {occupant.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-center">
                          <h4
                            className={`font-medium ${occupant.needsPaymentLink ? "text-white" : "text-gray-800"}`}
                          >
                            {occupant.name}
                          </h4>
                          <Badge
                            className={`mt-1 ${occupant.needsPaymentLink ? "bg-white text-teal-500" : "bg-teal-100 text-teal-600"}`}
                          >
                            {occupant.type}
                          </Badge>
                        </div>
                        <div
                          className={`text-sm mt-2 ${occupant.needsPaymentLink ? "text-white" : "text-gray-500"}`}
                        >
                          {occupant.dates}
                        </div>
                        {occupant.needsPaymentLink && (
                          <div className="mt-2 text-white text-sm">
                            {occupant.status}
                          </div>
                        )}
                      </div>
  
                      <div className="p-4 flex flex-col items-center">
                        <div className="text-xl font-medium">
                          {occupant.amount}
                        </div>
                        <div
                          className={`text-sm ${occupant.needsPaymentLink ? "text-gray-500" : "text-green-500"}`}
                        >
                          {!occupant.needsPaymentLink && occupant.status}
                        </div>
                        {occupant.needsPaymentLink && (
                          <Button className="mt-2 bg-teal-600 hover:bg-teal-700 text-white text-sm py-1 px-3 rounded-md">
                            Send Payment Link
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
  
            {/* Current occupants section */}
            <div>
              <h3 className="font-medium mb-4">Current occupants</h3>
              <div className="grid grid-cols-2 gap-4">
                {currentOccupants.map((occupant, index) => (
                  <Card key={index} className="overflow-hidden bg-white">
                    <CardContent className="p-0">
                      <div className="p-4 flex items-center">
                        <Avatar className="h-12 w-12 mr-3">
                          <AvatarImage src={occupant.image} alt={occupant.name} />
                          <AvatarFallback>
                            {occupant.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{occupant.name}</h4>
                          <Badge className="mt-1 bg-teal-100 text-teal-600">
                            {occupant.type}
                          </Badge>
                          <div className="text-sm mt-1 text-gray-500">
                            {occupant.dates}
                          </div>
                        </div>
                      </div>
  
                      <div className="p-4 flex flex-col items-end">
                        <div className="text-xl font-medium">
                          {occupant.amount}
                        </div>
                        <div className="text-sm text-green-500">
                          {occupant.status}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
  
          {/* Right sidebar */}
          <div className="w-80 p-6 bg-white">
            {/* Calendar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-blue-600">Calendar</h3>
              </div>
  
              <Calendar
                events={calendarEvents}
                onDateSelect={handleDateSelect}
                onEventClick={handleEventClick}
                className="rounded-md border"
              />
            </div>
  
            {/* Analytics */}
            <div className="mb-8">
              <h3 className="font-medium mb-4">Analytics</h3>
              <div className="relative h-40 w-40 mx-auto mb-4">
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-2xl font-bold">75%</span>
                  <span className="text-sm text-gray-500">Occupancy rate</span>
                </div>
                <Progress value={75} className="h-40 w-40 rounded-full" />
              </div>
  
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Occupancy rate:</span>
                  <span className="font-medium">75%</span>
                </div>
                <div className="flex justify-between">
                  <span>Vacancy:</span>
                  <span className="font-medium">25%</span>
                </div>
              </div>
            </div>
  
            {/* Monthly Revenue */}
            <div className="mb-8">
              <h3 className="font-medium mb-4">Monthly Revenue</h3>
              <div className="h-40 flex items-end space-x-2">
                {revenueData.map((item, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div
                      className="w-full bg-blue-400 rounded-t-sm"
                      style={{
                        height: `${item.value}%`,
                        backgroundColor: index === 4 ? "#6ECEC0" : undefined,
                      }}
                    ></div>
                    <div className="text-xs mt-2 text-gray-500">
                      {item.month.split(" ")[0]}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.month.split(" ")[1]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
  
            {/* Add occupants button */}
            <Button className="w-full bg-teal-400 hover:bg-teal-500 text-white">
              <PlusIcon className="w-4 h-4 mr-1" />
              ADD OCCUPANTS
            </Button>
          </div>
        </div>
      </div>
    );
  };
  