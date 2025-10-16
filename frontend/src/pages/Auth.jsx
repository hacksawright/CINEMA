import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      // const { error } = await supabase.auth.signInWithPassword({ email, password });
      // if (error) {
      //   if (error.message.includes("Invalid login credentials")) {
      //     toast({ title: "Lỗi", description: "Email hoặc mật khẩu không đúng", variant: "destructive" });
      //   } else {
      //     toast({ title: "Lỗi", description: error.message, variant: "destructive" });
      //   }
      // }
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
      const redirectUrl = `${window.location.origin}/`;
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: redirectUrl, data: { full_name: fullName } },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          toast({ title: "Lỗi", description: "Email này đã được đăng ký. Vui lòng đăng nhập thay vào đó.", variant: "destructive" });
        } else {
          toast({ title: "Lỗi", description: error.message, variant: "destructive" });
        }
      } else {
        toast({ title: "Tài khoản đã được tạo!", description: "Bây giờ bạn có thể đăng nhập với thông tin đăng nhập của mình." });
      }
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
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Họ và Tên</Label>
                    <Input id="signup-name" name="fullName" type="text" placeholder="Nguyễn Văn A" />
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


