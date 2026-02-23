"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Code2 } from "lucide-react"

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const supabase = createClient()
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) {
                setError(error.message)
            } else {
                router.push("/admin")
                router.refresh()
            }
        } catch (err) {
            setError("Đã xảy ra lỗi. Vui lòng thử lại.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="flex items-center justify-center gap-2.5 mb-8">
                    <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
                        <Code2 className="text-primary h-6 w-6" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-foreground text-2xl font-bold tracking-tight">DevBlog</span>
                        <span className="text-muted-foreground text-sm">Admin Login</span>
                    </div>
                </div>

                {/* Login Form */}
                <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
                    <h1 className="text-2xl font-bold mb-6">Đăng nhập</h1>

                    {error && (
                        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-2">
                                Email
                            </label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@example.com"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium mb-2">
                                Mật khẩu
                            </label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                disabled={loading}
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        <p>Chỉ dành cho quản trị viên</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
