import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const API_BASE_URL = 'http://localhost:8080/api/auth'; 

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      navigate("/", { replace: true }); 
    }
  }, [navigate]);

  
  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (response.ok) {
    
        localStorage.setItem('jwtToken', data.token);
        localStorage.setItem('userId', data.userId); 

        toast({ title: "Thành công!", description: "Đăng nhập thành công!" });
        
        // CHUYỂN HƯỚNG VỀ TRANG CHỦ
        navigate("/", { replace: true }); 

      } else {
        // ĐĂNG NHẬP THẤT BẠI (401 Unauthorized, v.v.)
        const errorMessage = data.message || "Email hoặc mật khẩu không đúng.";
        toast({ title: "Lỗi", description: errorMessage, variant: "destructive" });
      }
    } catch (error) {
        // Lỗi kết nối mạng
        toast({ title: "Lỗi", description: "Không thể kết nối đến máy chủ Java.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    const fullName = formData.get("fullName"); 

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            email, 
            password, 
            fullName 
        }),
      });
      const errorText = await response.text(); 
      if (response.ok) {
        toast({ title: "Tài khoản đã được tạo!", description: "Bây giờ bạn có thể đăng nhập với thông tin đã đăng ký." });
      } else {
        // Lỗi 400 Bad Request từ Java Backend
        toast({ title: "Lỗi", description: errorText, variant: "destructive" });
      }
    } catch (error) {
        toast({ title: "Lỗi", description: "Không thể kết nối đến máy chủ Java.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-3xl font-bold text-primary mb-2">
            <Film className="h-8 w-8" />
            <span>CinemaTickets</span>
          </div>
          <p className="text-muted-foreground">Trải nghiệm đặt vé phim cao cấp của bạn</p>
        </div>

        <Card className="border-border">
          <CardHeader>
            <CardTitle>Chào Mừng</CardTitle>
            <CardDescription>Đăng nhập để đặt vé cho những bộ phim yêu thích</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Đăng Nhập</TabsTrigger>
                <TabsTrigger value="signup">Đăng Ký</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                {/* Đã liên kết onSubmit với handleSignIn */}
                <form onSubmit={handleSignIn} className="space-y-4"> 
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input id="signin-email" name="email" type="email" placeholder="email@example.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Mật Khẩu</Label>
                    <Input id="signin-password" name="password" type="password" placeholder="••••••" required />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Đang đăng nhập..." : "Đăng Nhập"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                {/* Đã liên kết onSubmit với handleSignUp */}
                <form onSubmit={handleSignUp} className="space-y-4"> 
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Họ và Tên</Label>
                    <Input id="signup-name" name="fullName" type="text" placeholder="Nguyễn Văn A" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input id="signup-email" name="email" type="email" placeholder="email@example.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Mật Khẩu</Label>
                    <Input id="signup-password" name="password" type="password" placeholder="••••••" required />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Đang tạo tài khoản..." : "Tạo Tài Khoản"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}