import { useState } from "react";
import { MapPin, Settings, Save, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const SeatManagement = () => {
  const [selectedRoom, setSelectedRoom] = useState("room1");
  const [seatType, setSeatType] = useState("standard");
  const [isEditing, setIsEditing] = useState(false);

  // Mock seat data - replace with actual API calls
  const rooms = [
    { id: "room1", name: "Phòng chiếu 1", capacity: 120 },
    { id: "room2", name: "Phòng chiếu 2", capacity: 100 },
    { id: "room3", name: "Phòng chiếu 3", capacity: 80 }
  ];

  const seatTypes = {
    standard: { label: "Ghế thường", color: "bg-muted", price: 120000 },
    vip: { label: "Ghế VIP", color: "bg-primary", price: 180000 },
    couple: { label: "Ghế đôi", color: "bg-secondary", price: 200000 },
    disabled: { label: "Ghế hỏng", color: "bg-destructive", price: 0 },
    occupied: { label: "Đã đặt", color: "bg-green-600", price: 0 }
  };

  // Generate seat layout (10 rows x 12 seats)
  const generateSeatLayout = () => {
    const rows = 10;
    const seatsPerRow = 12;
    const layout = [];

    for (let row = 0; row < rows; row++) {
      const rowSeats = [];
      for (let seat = 0; seat < seatsPerRow; seat++) {
        const seatId = `${String.fromCharCode(65 + row)}${String(seat + 1).padStart(2, '0')}`;
        const isAisle = seat === 5 || seat === 6; // Middle aisle
        
        rowSeats.push({
          id: seatId,
          row: row,
          seat: seat,
          type: isAisle ? 'aisle' : 'standard',
          occupied: Math.random() > 0.7 // Random occupied status for demo
        });
      }
      layout.push(rowSeats);
    }
    return layout;
  };

  const [seatLayout, setSeatLayout] = useState(generateSeatLayout());

  const handleSeatClick = (rowIndex, seatIndex) => {
    if (!isEditing) return;
    
    const newLayout = [...seatLayout];
    const seat = newLayout[rowIndex][seatIndex];
    
    if (seat.type === 'aisle') return; // Don't allow editing aisle seats
    
    // Cycle through seat types
    const typeOrder = ['standard', 'vip', 'couple', 'disabled'];
    const currentIndex = typeOrder.indexOf(seat.type);
    const nextIndex = (currentIndex + 1) % typeOrder.length;
    
    newLayout[rowIndex][seatIndex] = {
      ...seat,
      type: typeOrder[nextIndex],
      occupied: typeOrder[nextIndex] === 'disabled' ? false : seat.occupied
    };
    
    setSeatLayout(newLayout);
  };

  const getSeatStyle = (seat) => {
    if (seat.type === 'aisle') return "invisible";
    
    const baseStyle = "w-8 h-8 rounded border-2 cursor-pointer transition-all hover:scale-110";
    const typeStyle = seatTypes[seat.type]?.color || "bg-muted";
    const occupiedStyle = seat.occupied ? "opacity-50" : "";
    
    return cn(baseStyle, typeStyle, occupiedStyle);
  };

  const saveLayout = () => {
    // Save seat layout to backend
    console.log("Saving seat layout for room:", selectedRoom, seatLayout);
    setIsEditing(false);
  };

  const resetLayout = () => {
    setSeatLayout(generateSeatLayout());
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sơ đồ ghế</h1>
          <p className="text-muted-foreground">Quản lý sơ đồ ghế theo phòng chiếu</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={isEditing ? "default" : "outline"}
            onClick={() => setIsEditing(!isEditing)}
          >
            <Settings className="h-4 w-4 mr-2" />
            {isEditing ? "Hoàn thành" : "Chỉnh sửa"}
          </Button>
          {isEditing && (
            <>
              <Button variant="outline" onClick={resetLayout}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Đặt lại
              </Button>
              <Button onClick={saveLayout}>
                <Save className="h-4 w-4 mr-2" />
                Lưu
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Room selection and controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex-1">
              <Label className="text-sm font-medium">Chọn phòng chiếu</Label>
              <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                <SelectTrigger className="w-full sm:w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((room) => (
                    <SelectItem key={room.id} value={room.id}>
                      {room.name} ({room.capacity} ghế)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {isEditing && (
              <div className="flex gap-2">
                <Label className="text-sm font-medium">Loại ghế:</Label>
                <Select value={seatType} onValueChange={setSeatType}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(seatTypes).map(([key, type]) => (
                      <SelectItem key={key} value={key}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Seat legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Chú thích loại ghế</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {Object.entries(seatTypes).map(([key, type]) => (
              <div key={key} className="flex items-center gap-2">
                <div className={cn("w-6 h-6 rounded border-2", type.color)} />
                <span className="text-sm">{type.label}</span>
                {type.price > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {type.price.toLocaleString('vi-VN')} ₫
                  </Badge>
                )}
              </div>
            ))}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded border-2 bg-muted opacity-50" />
              <span className="text-sm">Đã đặt</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Screen */}
      <div className="text-center">
        <div className="inline-block bg-gradient-to-r from-primary/20 to-secondary/20 px-8 py-2 rounded-lg border border-border">
          <span className="text-lg font-semibold text-foreground">MÀN HÌNH</span>
        </div>
      </div>

      {/* Seat layout */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center space-y-2">
            {/* Row labels */}
            <div className="flex gap-2 mb-4">
              <div className="w-8"></div>
              {Array.from({ length: 12 }, (_, i) => (
                <div key={i} className="w-8 text-center text-xs text-muted-foreground">
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Seat rows */}
            {seatLayout.map((row, rowIndex) => (
              <div key={rowIndex} className="flex items-center gap-2">
                <div className="w-8 text-center text-sm font-medium text-muted-foreground">
                  {String.fromCharCode(65 + rowIndex)}
                </div>
                <div className="flex gap-1">
                  {row.map((seat, seatIndex) => (
                    <div
                      key={seat.id}
                      className={getSeatStyle(seat)}
                      onClick={() => handleSeatClick(rowIndex, seatIndex)}
                      title={`${seat.id} - ${seatTypes[seat.type]?.label || 'Ghế thường'}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Room statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tổng ghế</p>
                <p className="text-2xl font-bold text-foreground">
                  {seatLayout.flat().filter(seat => seat.type !== 'aisle').length}
                </p>
              </div>
              <MapPin className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ghế VIP</p>
                <p className="text-2xl font-bold text-primary">
                  {seatLayout.flat().filter(seat => seat.type === 'vip').length}
                </p>
              </div>
              <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary text-sm font-bold">V</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ghế đôi</p>
                <p className="text-2xl font-bold text-secondary">
                  {seatLayout.flat().filter(seat => seat.type === 'couple').length}
                </p>
              </div>
              <div className="h-8 w-8 bg-secondary/10 rounded-full flex items-center justify-center">
                <span className="text-secondary text-sm font-bold">C</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Đã đặt</p>
                <p className="text-2xl font-bold text-green-600">
                  {seatLayout.flat().filter(seat => seat.occupied).length}
                </p>
              </div>
              <div className="h-8 w-8 bg-green-600/10 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm font-bold">✓</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SeatManagement;
