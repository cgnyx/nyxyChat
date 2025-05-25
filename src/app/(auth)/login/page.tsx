
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import type { LoginFormValues} from "@/components/auth/auth-forms-common";
import { LoginSchema, Link, Button, Input, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, GoogleSignInButton } from "@/components/auth/auth-forms-common";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      toast({ title: "Login Successful", description: "Welcome back!" });
      router.push("/"); // Redirect to home, which will handle routing to dashboard
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-2xl">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center text-primary">SynapseChat Login</CardTitle>
        <CardDescription className="text-center">
          Access your account or{" "}
          <Button variant="link" className="p-0 h-auto" asChild>
             <Link href="/signup">create a new one</Link>
          </Button>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Login
            </Button>
          </form>
        </Form>
        <div className="my-6 flex items-center">
          <Separator className="flex-grow" />
          <span className="mx-4 text-xs text-muted-foreground">OR</span>
          <Separator className="flex-grow" />
        </div>
        <GoogleSignInButton />
      </CardContent>
      <CardFooter className="justify-center">
         <Button variant="link" size="sm" asChild>
            <Link href="/forgot-password">Forgot password?</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
