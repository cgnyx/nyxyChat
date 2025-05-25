
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import type { SignupFormValues } from "@/components/auth/auth-forms-common";
import { SignupSchema, Link, Button, Input, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, GoogleSignInButton } from "@/components/auth/auth-forms-common";

import { auth, db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import type { UserProfile } from "@/types";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      displayName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      // Update Firebase Auth profile
      await updateProfile(user, { displayName: data.displayName });

      // Create user profile in Firestore
      const userProfileData: Omit<UserProfile, 'id'> = { // id is implicit from doc path
        uid: user.uid,
        displayName: data.displayName,
        email: user.email,
        photoURL: user.photoURL, // Initially null, can be updated later
        createdAt: serverTimestamp() as any,
      };
      await setDoc(doc(db, "users", user.uid), userProfileData);

      toast({ title: "Account Created!", description: "Welcome to SynapseChat!" });
      router.push("/"); // Redirect to home, which will handle routing to dashboard
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Signup Failed",
        description: error.message || "Could not create an account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-2xl">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center text-primary">Create SynapseChat Account</CardTitle>
        <CardDescription className="text-center">
          Already have an account?{" "}
          <Button variant="link" className="p-0 h-auto" asChild>
            <Link href="/login">Log in</Link>
          </Button>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
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
      <CardFooter className="flex-col items-center text-xs text-muted-foreground">
        <p>By signing up, you agree to our imaginary</p>
        <p>
          <Button variant="link" size="sm" className="p-0 h-auto" asChild><Link href="/terms">Terms of Service</Link></Button> and 
          <Button variant="link" size="sm" className="p-0 h-auto ml-1" asChild><Link href="/privacy">Privacy Policy</Link></Button>.
        </p>
      </CardFooter>
    </Card>
  );
}
