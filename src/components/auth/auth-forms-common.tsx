
import { z } from "zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { GoogleSignInButton } from "./google-sign-in-button";

export const commonEmailPasswordSchema = {
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
};

export const SignupSchema = z.object({
  ...commonEmailPasswordSchema,
  displayName: z.string().min(3, { message: "Display name must be at least 3 characters." }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match.",
  path: ["confirmPassword"], // path of error
});

export const LoginSchema = z.object(commonEmailPasswordSchema);

export type SignupFormValues = z.infer<typeof SignupSchema>;
export type LoginFormValues = z.infer<typeof LoginSchema>;

export {
  Link,
  Button,
  Input,
  Label,
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
  GoogleSignInButton
};
