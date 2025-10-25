import { useState, useEffect } from "react";
import { MapPin, Settings, Save, RotateCcw, Plus, Edit, Trash2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { getAllRoomsAdmin, getRoomLayoutAdmin, updateRoomLayoutAdmin, createRoomAdmin, updateRoomAdmin, deleteRoomAdmin } from "@/services/admin";

const RoomForm = ({ room = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: room?.name || "",
    totalRows: room?.totalRows || 10,
    seatsPerRow: room?.seatsPerRow || 12,
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Tên phòng là bắt buộc";
    if (!formData.totalRows || formData.totalRows <= 0) newErrors.totalRows = "Số hàng phải lớn hơn 0";
    if (!formData.seatsPerRow || formData.seatsPerRow <= 0) newErrors.seatsPerRow = "Số ghế/hàng phải lớn hơn 0";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        ...formData,
        totalRows: parseInt(formData.totalRows, 10),
        seatsPerRow: parseInt(formData.seatsPerRow, 10),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="roomName">Tên phòng</Label>
        <Input
          id="roomName"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={errors.name ? "border-destructive" : ""}
        />
        {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="totalRows">Số hàng ghế</Label>
          <Input
            id="totalRows"
            type="number"
            min="1"
            value={formData.totalRows}
            onChange={(e) => setFormData({ ...formData, totalRows: e.target.value })}
            className={errors.totalRows ? "border-destructive" : ""}
          />
           {errors.totalRows && <p className="text-sm text-destructive mt-1">{errors.totalRows}</p>}
        </div>
        <div>
          <Label htmlFor="seatsPerRow">Số ghế mỗi hàng</Label>
          <Input
            id="seatsPerRow"
            type="number"
            min="1"
            value={formData.seatsPerRow}
            onChange={(e) => setFormData({ ...formData, seatsPerRow: e.target.value })}
            className={errors.seatsPerRow ? "border-destructive" : ""}
          />
           {errors.seatsPerRow && <p className="text-sm text-destructive mt-1">{errors.seatsPerRow}</p>}
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>Hủy</Button>
        <Button type="submit">{room ? "Cập nhật phòng" : "Thêm phòng"}</Button>
      </DialogFooter>
    </form>
  );
};


const SeatManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [isEditingLayout, setIsEditingLayout] = useState(false);
  const [seatLayout, setSeatLayout] = useState([]);
  const [roomDetails, setRoomDetails] = useState({ totalRows: 0, seatsPerRow: 0 });
  const [loadingLayout, setLoadingLayout] = useState(false);
  const [savingLayout, setSavingLayout] = useState(false);
  const { toast } = useToast();

  const [isRoomDialogOpen, setIsRoomDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingRoomId, setDeletingRoomId] = useState(null);

  const seatTypes = {
    STANDARD: { label: "Ghế thường", color: "bg-muted" },
    VIP: { label: "Ghế VIP", color: "bg-primary" },
    COUPLE: { label: "Ghế đôi", color: "bg-secondary" },
    DISABLED: { label: "Ghế hỏng", color: "bg-destructive" },
    AISLE: { label: "Lối đi", color: "invisible" }
  };

  const fetchRooms = async () => {
    try {
      const roomsData = await getAllRoomsAdmin();
      setRooms(roomsData || []);
      if (!selectedRoomId || !roomsData.some(r => r.id.toString() === selectedRoomId)) {
           if (roomsData && roomsData.length > 0) {
              setSelectedRoomId(roomsData[0].id.toString());
           } else {
              setSelectedRoomId("");
               setSeatLayout([]);
               setRoomDetails({ totalRows: 0, seatsPerRow: 0 });
           }
      }

    } catch (error) {
      toast({ title: "Lỗi", description: "Không thể tải danh sách phòng.", variant: "destructive" });
    }
  };

   const fetchLayout = async (roomIdToFetch) => {
      if (!roomIdToFetch) return;
      setLoadingLayout(true);
      setIsEditingLayout(false);
      try {
        const layoutData = await getRoomLayoutAdmin(roomIdToFetch);
        const gridLayout = Array.from({ length: layoutData.totalRows }, () =>
          Array(layoutData.seatsPerRow).fill(null)
        );
         let maxRow = -1;
         let maxCol = -1;
         (layoutData.seats || []).forEach(seat => {
           const rowIndex = seat.rowLabel.charCodeAt(0) - 65;
           const colIndex = seat.seatNumber - 1;
           if (rowIndex >= 0 && rowIndex < layoutData.totalRows && colIndex >= 0 && colIndex < layoutData.seatsPerRow) {
             gridLayout[rowIndex][colIndex] = { ...seat, originalType: seat.type };
             maxRow = Math.max(maxRow, rowIndex);
             maxCol = Math.max(maxCol, colIndex);
           }
         });
         const finalLayout = maxRow === -1 ? [] : gridLayout.slice(0, maxRow + 1).map(row => row.slice(0, maxCol + 1));

        setSeatLayout(finalLayout);
        setRoomDetails({ totalRows: layoutData.totalRows, seatsPerRow: layoutData.seatsPerRow });
      } catch (error) {
        toast({ title: "Lỗi", description: `Không thể tải layout phòng ${roomIdToFetch}. ${error.message}`, variant: "destructive" });
        setSeatLayout([]);
        setRoomDetails({ totalRows: 0, seatsPerRow: 0 });
      } finally {
        setLoadingLayout(false);
      }
    };

  useEffect(() => {
    fetchRooms();
  }, [toast]);

  useEffect(() => {
    fetchLayout(selectedRoomId);
  }, [selectedRoomId, toast]);


  const handleSeatClick = (rowIndex, seatIndex) => {
    if (!isEditingLayout) return;
    const newLayout = seatLayout.map(row => row.map(seat => seat ? {...seat} : null));
    const seat = newLayout[rowIndex]?.[seatIndex];
    if (!seat || seat.type === 'AISLE') return;
    const editableTypes = ['STANDARD', 'VIP', 'COUPLE', 'DISABLED'];
    const currentIndex = editableTypes.indexOf(seat.type);
    const nextIndex = (currentIndex + 1) % editableTypes.length;
    seat.type = editableTypes[nextIndex];
    setSeatLayout(newLayout);
  };

   const getSeatStyle = (seat) => {
    if (!seat) return "w-8 h-8 opacity-0 pointer-events-none";
    if (seat.type === 'AISLE') return "w-8 h-8 invisible";
    const baseStyle = "w-8 h-8 rounded border-2 transition-all";
    const typeStyle = seatTypes[seat.type]?.color || "bg-gray-400";
     const cursorStyle = isEditingLayout ? "cursor-pointer hover:scale-110" : "cursor-default";
    return cn(baseStyle, typeStyle, cursorStyle);
  };

  const saveLayout = async () => {
     if (!selectedRoomId || seatLayout.length === 0) return;
     setSavingLayout(true);
     try {
        const flatSeatsDTO = seatLayout.flat().filter(seat => seat && seat.type !== 'AISLE').map(seat => ({
             id: seat.id,
             rowLabel: seat.rowLabel,
             seatNumber: seat.seatNumber,
             type: seat.type
        }));
        const payload = {
            roomId: parseInt(selectedRoomId, 10),
            roomName: rooms.find(r => r.id.toString() === selectedRoomId)?.name,
            totalRows: roomDetails.totalRows,
            seatsPerRow: roomDetails.seatsPerRow,
            seats: flatSeatsDTO
        };
       await updateRoomLayoutAdmin(selectedRoomId, payload);
       toast({ title: "Thành công", description: "Đã lưu layout phòng." });
       setIsEditingLayout(false);
     } catch (error) {
       toast({ title: "Lỗi", description: `Không thể lưu layout: ${error.message}`, variant: "destructive" });
     } finally {
       setSavingLayout(false);
     }
   };

  const resetLayout = () => {
    fetchLayout(selectedRoomId);
  };

  const handleRoomFormSubmit = async (formData) => {
      try {
          if (editingRoom) {
              await updateRoomAdmin(editingRoom.id, formData);
              toast({ title: "Thành công", description: `Đã cập nhật phòng "${formData.name}".` });
          } else {
              const newRoom = await createRoomAdmin(formData);
              toast({ title: "Thành công", description: `Đã thêm phòng "${newRoom.name}".` });
              setSelectedRoomId(newRoom.id.toString());
          }
          setIsRoomDialogOpen(false);
          setEditingRoom(null);
          fetchRooms();
      } catch (error) {
          toast({ title: "Lỗi", description: `Không thể ${editingRoom ? 'cập nhật' : 'thêm'} phòng: ${error.message}`, variant: "destructive" });
      }
  };

    const handleDeleteRoomConfirm = async () => {
        if (!deletingRoomId) return;
        try {
            await deleteRoomAdmin(deletingRoomId);
            toast({ title: "Thành công", description: "Đã xóa phòng." });
            setDeletingRoomId(null);
            setIsDeleteDialogOpen(false);
             const remainingRooms = rooms.filter(r => r.id.toString() !== deletingRoomId);
             if (remainingRooms.length > 0) {
                if (selectedRoomId === deletingRoomId) {
                    setSelectedRoomId(remainingRooms[0].id.toString());
                }
             } else {
                 setSelectedRoomId("");
                 setSeatLayout([]);
                 setRoomDetails({ totalRows: 0, seatsPerRow: 0 });
             }
            fetchRooms();

        } catch (error) {
            toast({ title: "Lỗi", description: `Không thể xóa phòng: ${error.message}`, variant: "destructive" });
             setDeletingRoomId(null);
            setIsDeleteDialogOpen(false);
        }
    };

  const selectedRoomDetails = rooms.find(r => r.id.toString() === selectedRoomId);

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sơ đồ ghế & Phòng chiếu</h1>
          <p className="text-muted-foreground">Quản lý phòng chiếu và sơ đồ ghế</p>
        </div>
        <Dialog open={isRoomDialogOpen} onOpenChange={(open) => { setIsRoomDialogOpen(open); if (!open) setEditingRoom(null); }}>
            <DialogTrigger asChild>
                 <Button onClick={() => setEditingRoom(null)}>
                     <Plus className="h-4 w-4 mr-2" /> Thêm phòng chiếu
                 </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{editingRoom ? "Chỉnh sửa phòng chiếu" : "Thêm phòng chiếu mới"}</DialogTitle>
                </DialogHeader>
                <RoomForm
                     room={editingRoom}
                     onSubmit={handleRoomFormSubmit}
                     onCancel={() => { setIsRoomDialogOpen(false); setEditingRoom(null); }}
                />
            </DialogContent>
        </Dialog>

      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-lg font-medium">Chọn phòng chiếu</CardTitle>
             {selectedRoomDetails && (
                 <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => { setEditingRoom(selectedRoomDetails); setIsRoomDialogOpen(true); }}>
                           <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                          <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => setDeletingRoomId(selectedRoomId)}>
                                   <Trash2 className="h-4 w-4" />
                              </Button>
                          </AlertDialogTrigger>
                           <AlertDialogContent>
                              <AlertDialogHeader>
                                  <AlertDialogTitle>Xác nhận xóa?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                      Hành động này không thể hoàn tác. Sơ đồ ghế của phòng "{selectedRoomDetails.name}" cũng sẽ bị xóa.
                                  </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                  <AlertDialogCancel onClick={() => setDeletingRoomId(null)}>Hủy</AlertDialogCancel>
                                  <AlertDialogAction onClick={handleDeleteRoomConfirm} className={cn(buttonVariants({ variant: "destructive" }))}>Xóa</AlertDialogAction>
                              </AlertDialogFooter>
                           </AlertDialogContent>
                      </AlertDialog>
                 </div>
             )}
        </CardHeader>
        <CardContent>
             <Select
                value={selectedRoomId}
                 onValueChange={setSelectedRoomId}
                 disabled={isEditingLayout || loadingLayout || rooms.length === 0}
              >
                <SelectTrigger className="w-full sm:w-64">
                   <SelectValue placeholder={rooms.length === 0 ? "Chưa có phòng nào" : "Chọn phòng..."} />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((room) => (
                    <SelectItem key={room.id} value={room.id.toString()}>
                       {/* Sửa lại hiển thị */}
                       {room.name} ({room.totalRows * room.seatsPerRow} ghế)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
        </CardContent>
      </Card>

       {selectedRoomId && (
           <>
              <div className="flex justify-end gap-2">
                 <Button
                    variant={isEditingLayout ? "default" : "outline"}
                    onClick={() => setIsEditingLayout(!isEditingLayout)}
                     disabled={savingLayout || loadingLayout}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    {isEditingLayout ? "Hoàn thành sửa layout" : "Chỉnh sửa layout"}
                  </Button>
                  {isEditingLayout && (
                    <>
                      <Button variant="outline" onClick={resetLayout} disabled={savingLayout || loadingLayout}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                         Tải lại layout
                      </Button>
                      <Button onClick={saveLayout} disabled={savingLayout || loadingLayout}>
                         {savingLayout ? "Đang lưu..." : <> <Save className="h-4 w-4 mr-2" /> Lưu layout </>}
                      </Button>
                    </>
                  )}
              </div>

              <Card>
                <CardHeader><CardTitle className="text-lg">Chú thích loại ghế</CardTitle></CardHeader>
                <CardContent>
                   <div className="flex flex-wrap gap-4">
                     {Object.entries(seatTypes)
                       .filter(([key]) => key !== 'AISLE')
                       .map(([key, type]) => (
                         <div key={key} className="flex items-center gap-2">
                           <div className={cn("w-6 h-6 rounded border-2", type.color)} />
                           <span className="text-sm">{type.label}</span>
                         </div>
                       ))}
                   </div>
                   {isEditingLayout && <p className="text-sm text-primary mt-3">Nhấn vào ghế để thay đổi loại.</p>}
                </CardContent>
              </Card>

              <div className="text-center">
                <div className="inline-block bg-gradient-to-r from-primary/20 to-secondary/20 px-8 py-2 rounded-lg border border-border">
                  <span className="text-lg font-semibold text-foreground">MÀN HÌNH</span>
                </div>
              </div>

               <Card>
                 <CardContent className="p-6 overflow-x-auto">
                   {loadingLayout ? (
                     <p className="text-center text-muted-foreground">Đang tải layout...</p>
                   ) : seatLayout.length > 0 ? (
                     <div className="flex flex-col items-center space-y-1 min-w-max">
                       {seatLayout.map((row, rowIndex) => (
                         <div key={rowIndex} className="flex items-center gap-1">
                           <div className="w-8 text-center text-sm font-medium text-muted-foreground">{String.fromCharCode(65 + rowIndex)}</div>
                           <div className="flex gap-1">
                             {(row || []).map((seat, seatIndex) => (
                               <div
                                 key={seat ? seat.id || `${rowIndex}-${seatIndex}` : `empty-${rowIndex}-${seatIndex}`}
                                 className={getSeatStyle(seat)}
                                 onClick={() => handleSeatClick(rowIndex, seatIndex)}
                                 title={seat && seat.type !== 'AISLE' ? `${seat.rowLabel}${seat.seatNumber} - ${seatTypes[seat.type]?.label || seat.type}` : ''}
                               />
                             ))}
                           </div>
                           <div className="w-8 text-center text-sm font-medium text-muted-foreground">{String.fromCharCode(65 + rowIndex)}</div>
                         </div>
                       ))}
                        <div className="flex gap-1 mt-2">
                            <div className="w-8"></div>
                            {seatLayout[0]?.map((_, seatIndex) => (
                                <div key={seatIndex} className="w-8 text-center text-xs text-muted-foreground">{seatIndex + 1}</div>
                            ))}
                            <div className="w-8"></div>
                        </div>
                     </div>
                   ) : (
                     <p className="text-center text-muted-foreground">Phòng này chưa có sơ đồ ghế hoặc không thể tải.</p>
                   )}
                 </CardContent>
               </Card>

               {selectedRoomDetails && !loadingLayout && (
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Tổng ghế (Layout)</p><p className="text-2xl font-bold">{seatLayout.flat().filter(s => s && s.type !== 'AISLE').length}</p></CardContent></Card>
                     <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Ghế VIP</p><p className="text-2xl font-bold text-primary">{seatLayout.flat().filter(s => s?.type === 'VIP').length}</p></CardContent></Card>
                     <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Ghế đôi</p><p className="text-2xl font-bold text-secondary">{seatLayout.flat().filter(s => s?.type === 'COUPLE').length}</p></CardContent></Card>
                     <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Ghế hỏng</p><p className="text-2xl font-bold text-destructive">{seatLayout.flat().filter(s => s?.type === 'DISABLED').length}</p></CardContent></Card>
                 </div>
               )}
           </>
       )}
    </div>
  );
};

export default SeatManagement;