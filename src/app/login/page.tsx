'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUser, useAuth } from '@/firebase';
import { initiateEmailSignIn, initiateEmailSignUp } from '@/firebase/non-blocking-login';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const auth = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleAuthAction = async (action: 'signIn' | 'signUp') => {
    if (!email || !password) {
      toast({
        variant: 'destructive',
        title: '错误',
        description: '请输入邮箱和密码。',
      });
      return;
    }
    setIsSubmitting(true);
    try {
      if (action === 'signIn') {
        await initiateEmailSignIn(auth, email, password);
      } else {
        await initiateEmailSignUp(auth, email, password);
      }
      // The onAuthStateChanged listener in the provider will handle the redirect
    } catch (error: any) {
      let message = '发生未知错误。';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        message = '邮箱或密码不正确。'
      } else if (error.code === 'auth/email-already-in-use') {
        message = '该邮箱已被注册。'
      } else if (error.code === 'auth/weak-password') {
        message = '密码太弱，请使用至少6个字符。'
      }
      toast({
        variant: 'destructive',
        title: '认证失败',
        description: message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isUserLoading || user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <p>加载中...</p>
      </div>
    );
  }

  return (
    <div className="container flex items-center justify-center py-12">
      <Tabs defaultValue="login" className="w-full max-w-md">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">登录</TabsTrigger>
          <TabsTrigger value="signup">注册</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>欢迎回来</CardTitle>
              <CardDescription>
                登录以访问您的视力追踪历史。
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">邮箱</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">密码</Label>
                <Input
                  id="login-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleAuthAction('signIn')} className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                登录
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="signup">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>创建账户</CardTitle>
              <CardDescription>
                立即开始追踪您的视力健康。
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-email">邮箱</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">密码</Label>
                <Input
                  id="signup-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleAuthAction('signUp')} className="w-full" disabled={isSubmitting}>
                 {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                注册
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}