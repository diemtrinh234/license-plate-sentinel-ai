import React, { useEffect, useState } from 'react';
import { preloadCNNModel } from '@/utils/licensePlateCNN';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, CheckCircle2, Loader2 } from 'lucide-react';

export const CNNLoadingIndicator: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        console.log('Starting CNN model preload...');
        await preloadCNNModel();
        console.log('CNN model loaded successfully');
        setLoading(false);
      } catch (err) {
        console.error('Failed to load CNN model:', err);
        setError(err instanceof Error ? err.message : 'Failed to load model');
        setLoading(false);
      }
    };

    loadModel();
  }, []);

  if (!loading && !error) {
    return null; // Don't show anything when loaded successfully
  }

  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Brain className="h-4 w-4 text-primary" />
                  <p className="text-sm font-medium">Đang tải mô hình CNN...</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Lần đầu tiên có thể mất vài giây. Vui lòng đợi...
                </p>
              </div>
            </>
          ) : error ? (
            <>
              <div className="h-5 w-5 rounded-full bg-destructive/10 flex items-center justify-center">
                <span className="text-destructive text-xs">!</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-destructive">Không thể tải mô hình CNN</p>
                <p className="text-xs text-muted-foreground">{error}</p>
              </div>
            </>
          ) : (
            <>
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-500">Mô hình CNN đã sẵn sàng</p>
                <p className="text-xs text-muted-foreground">
                  Sử dụng công nghệ TrOCR để nhận dạng biển số
                </p>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
