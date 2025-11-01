
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ thêm dòng này
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function Account() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null); 
  const { toast } = useToast();

  useEffect(() => { 
      const token = sessionStorage.getItem('jwtToken');
      const fullName = sessionStorage.getItem('fullName');
      const userId = sessionStorage.getItem('userId');
      const userEmail = sessionStorage.getItem('userEmail'); 

      if (!token || !userId) { 
          navigate("/auth"); 
          return; 
      }

      setUserProfile({ id: userId, email: userEmail, fullName: fullName });
      setLoading(false);
  }, [navigate]);

  if (loading) {
      return <div className="flex justify-center items-center h-screen text-white">Đang tải...</div>;
  }

  if (!userProfile) {
      return <div className="text-center text-white mt-10">Không tìm thấy thông tin người dùng</div>;
  }

  return (
      <Layout>
          <div className="p-6 text-white">
              <h1 className="text-2xl font-bold mb-4">Tài khoản của bạn</h1>
              <Card className="bg-[#1F1F1F] text-white">
                  <CardHeader>
                      <CardTitle>Thông tin cá nhân</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <p><strong>Họ tên:</strong> {userProfile.fullName}</p>
                      <p><strong>Email:</strong> {userProfile.email}</p>
                      <p><strong>ID người dùng:</strong> {userProfile.id}</p>
                  </CardContent>
              </Card>
          </div>
      </Layout>
  );
}