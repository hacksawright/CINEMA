import { Layout } from "@/components/Layout.jsx";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home, Film } from "lucide-react";

export default function NotFound() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-md mx-auto">
          <div className="mb-8">
            <Film className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Trang Không Tìm Thấy</h2>
            <p className="text-muted-foreground mb-8">
              Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
            </p>
          </div>
          <div className="space-y-4">
            <Link to="/">
              <Button className="w-full">
                <Home className="h-4 w-4 mr-2" />
                Về Trang Chủ
              </Button>
            </Link>
            <Button variant="outline" onClick={() => window.history.back()}>
              Quay Lại
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}


