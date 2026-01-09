"use client"

import { useState } from "react"
import { useLanguage } from "@/context/language-context"
import { useBlog, type URLShortenerConfig } from "@/context/blog-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Globe, Key, Eye, EyeOff, Play, CheckCircle2, XCircle, Clock, Save, Link2 } from "lucide-react"

export default function URLShortenerSettings() {
  const { language, t } = useLanguage()
  const { urlConfigs, updateUrlConfig, urlLogs, addUrlLog } = useBlog()
  const currentLang = language as "en" | "vi"

  const [activeTab, setActiveTab] = useState<"en" | "vi">("en")
  const [showKey, setShowKey] = useState(false)
  const [testUrl, setTestUrl] = useState("")
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const [isTesting, setIsTesting] = useState(false)

  const [formData, setFormData] = useState<URLShortenerConfig>(
    urlConfigs[activeTab] || {
      provider: "",
      endpoint: "",
      apiKey: "",
      httpMethod: "POST",
      bodyFormat: '{\n  "url": "{{original_url}}"\n}',
      active: false,
    },
  )

  const handleTabChange = (tab: "en" | "vi") => {
    setActiveTab(tab)
    setFormData(
      urlConfigs[tab] || {
        provider: "",
        endpoint: "",
        apiKey: "",
        httpMethod: "POST",
        bodyFormat: '{\n  "url": "{{original_url}}"\n}',
        active: false,
      },
    )
  }

  const handleInputChange = (field: keyof URLShortenerConfig, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = () => {
    updateUrlConfig(activeTab, formData)
    alert(language === "en" ? "Settings saved successfully" : "Cài đặt đã được lưu thành công")
  }

  const handleTestAPI = async () => {
    if (!testUrl) {
      alert(language === "en" ? "Please enter a test URL" : "Vui lòng nhập URL để test")
      return
    }

    setIsTesting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const success = Math.random() > 0.3 // 70% success rate for demo
      const message = success ? `http://short.url/${Math.random().toString(36).substr(2, 6)}` : "Connection failed"

      setTestResult({
        success,
        message,
      })

      addUrlLog({
        originalUrl: testUrl,
        shortenedUrl: success ? message : "",
        language: activeTab,
        status: success ? "success" : "failed",
        message: success ? undefined : message,
      })
    } finally {
      setIsTesting(false)
    }
  }

  const recentLogs = urlLogs.filter((log) => log.language === activeTab).slice(0, 10)

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Link2 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">
            {language === "en" ? "URL Shortener" : "Rút gọn URL"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {language === "en" ? "Configure your URL shortening API" : "Cấu hình API rút gọn URL"}
          </p>
        </div>
      </div>

      {/* Tab Navigation - Pill style */}
      <div className="flex p-1 rounded-xl bg-muted/50 w-fit">
        {(["en", "vi"] as const).map((lang) => (
          <button
            key={lang}
            onClick={() => handleTabChange(lang)}
            className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === lang
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Globe className="w-4 h-4" />
            {lang === "en" ? "English API" : "Vietnamese API"}
          </button>
        ))}
      </div>

      {/* Configuration Form */}
      <Card>
        <CardHeader>
          <CardTitle>{language === "en" ? "API Configuration" : "Cấu hình API"}</CardTitle>
          <CardDescription>
            {language === "en" ? "Configure your URL shortening service" : "Cấu hình dịch vụ rút gọn URL của bạn"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Provider Name */}
          <div>
            <label className="block text-sm font-medium mb-2">
              {language === "en" ? "Provider Name" : "Tên nhà cung cấp"}
            </label>
            <Input
              placeholder={language === "en" ? "e.g., Bitly, TinyURL" : "VD: Bitly, TinyURL"}
              value={formData.provider}
              onChange={(e) => handleInputChange("provider", e.target.value)}
              className="bg-secondary text-foreground"
            />
          </div>

          {/* API Endpoint */}
          <div>
            <label className="block text-sm font-medium mb-2">
              {language === "en" ? "API Endpoint URL" : "URL Endpoint API"}
            </label>
            <Input
              placeholder={language === "en" ? "https://api.example.com/shorten" : "https://api.example.com/shorten"}
              value={formData.endpoint}
              onChange={(e) => handleInputChange("endpoint", e.target.value)}
              className="bg-secondary text-foreground"
            />
          </div>

          {/* API Key */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <Key className="w-4 h-4 text-muted-foreground" />
              {language === "en" ? "API Key" : "Khóa API"}
            </label>
            <div className="flex gap-2">
              <Input
                type={showKey ? "text" : "password"}
                placeholder={language === "en" ? "Enter your API key" : "Nhập khóa API của bạn"}
                value={formData.apiKey}
                onChange={(e) => handleInputChange("apiKey", e.target.value)}
                className="bg-background border-border/70 font-mono"
              />
              <Button variant="outline" onClick={() => setShowKey(!showKey)} className="px-3 cursor-pointer border-border/70">
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* HTTP Method */}
          <div>
            <label className="block text-sm font-medium mb-2">
              {language === "en" ? "HTTP Method" : "Phương thức HTTP"}
            </label>
            <select
              value={formData.httpMethod}
              onChange={(e) => handleInputChange("httpMethod", e.target.value as "GET" | "POST" | "PUT")}
              className="w-full px-3 py-2 bg-secondary text-foreground border border-border rounded-lg"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
            </select>
          </div>

          {/* Body Format JSON Editor */}
          <div>
            <label className="block text-sm font-medium mb-2">
              {language === "en" ? "Body Format (JSON)" : "Định dạng Body (JSON)"}
            </label>
            <Textarea
              value={formData.bodyFormat}
              onChange={(e) => handleInputChange("bodyFormat", e.target.value)}
              className="font-mono text-sm bg-secondary text-foreground border border-border rounded-lg p-3"
              rows={6}
              placeholder={`{\n  "url": "{{original_url}}"\n}`}
            />
            <p className="text-xs text-muted-foreground mt-2">
              {language === "en"
                ? "Use {{original_url}} as placeholder for the URL to shorten"
                : "Sử dụng {{original_url}} làm trình giữ chỗ cho URL cần rút gọn"}
            </p>
          </div>

          {/* Active Toggle */}
          <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
            <label className="text-sm font-medium">
              {language === "en" ? "Activate this API" : "Kích hoạt API này"}
            </label>
            <button
              onClick={() => handleInputChange("active", !formData.active)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                formData.active ? "bg-primary" : "bg-border"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.active ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Test Section */}
      <Card>
        <CardHeader>
          <CardTitle>{language === "en" ? "Test API" : "Test API"}</CardTitle>
          <CardDescription>
            {language === "en" ? "Test your API configuration" : "Kiểm tra cấu hình API của bạn"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder={
                language === "en" ? "https://example.com/very/long/url" : "https://example.com/very/long/url"
              }
              value={testUrl}
              onChange={(e) => setTestUrl(e.target.value)}
              className="bg-secondary text-foreground"
            />
            <Button
              onClick={handleTestAPI}
              disabled={isTesting}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isTesting
                ? language === "en"
                  ? "Testing..."
                  : "Đang kiểm tra..."
                : language === "en"
                  ? "Test API"
                  : "Test API"}
            </Button>
          </div>

          {/* Test Result */}
          {testResult && (
            <div
              className={`p-4 rounded-lg border ${
                testResult.success
                  ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-900"
                  : "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-900"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center ${
                    testResult.success ? "bg-green-100 dark:bg-green-900/50" : "bg-red-100 dark:bg-red-900/50"
                  }`}
                >
                  {testResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                  )}
                </div>
                <div className="flex-1">
                  <p
                    className={`font-medium text-sm ${testResult.success ? "text-green-900 dark:text-green-100" : "text-red-900 dark:text-red-100"}`}
                  >
                    {testResult.success
                      ? language === "en"
                        ? "Success"
                        : "Thành công"
                      : language === "en"
                        ? "Failed"
                        : "Thất bại"}
                  </p>
                  <p
                    className={`text-sm mt-1 ${testResult.success ? "text-green-800 dark:text-green-200" : "text-red-800 dark:text-red-200"}`}
                  >
                    {testResult.message}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Logs Section */}
      <Card>
        <CardHeader>
          <CardTitle>{language === "en" ? "Recent Logs" : "Nhật ký gần đây"}</CardTitle>
          <CardDescription>
            {language === "en" ? "Recent URL shortening attempts" : "Các nỗ lực rút gọn URL gần đây"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentLogs.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              {language === "en" ? "No logs yet" : "Chưa có nhật ký"}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium">{language === "en" ? "Timestamp" : "Thời gian"}</th>
                    <th className="text-left py-3 px-4 font-medium">
                      {language === "en" ? "Original URL" : "URL gốc"}
                    </th>
                    <th className="text-left py-3 px-4 font-medium">
                      {language === "en" ? "Shortened URL" : "URL rút gọn"}
                    </th>
                    <th className="text-left py-3 px-4 font-medium">{language === "en" ? "Status" : "Trạng thái"}</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLogs.map((log) => (
                    <tr key={log.id} className="border-b border-border hover:bg-secondary/50">
                      <td className="py-3 px-4">{log.timestamp.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <div className="truncate text-xs text-muted-foreground" title={log.originalUrl}>
                          {log.originalUrl}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="truncate text-xs" title={log.shortenedUrl}>
                          {log.shortenedUrl || "-"}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            log.status === "success"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                          }`}
                        >
                          {log.status === "success"
                            ? language === "en"
                              ? "Success"
                              : "Thành công"
                            : language === "en"
                              ? "Failed"
                              : "Thất bại"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Button - Sticky */}
      <div className="sticky bottom-0 flex justify-end gap-3 p-4 -mx-6 md:-mx-8 bg-background/95 backdrop-blur-sm border-t border-border">
        <Button variant="outline" className="border-border/70 cursor-pointer gap-2">
          {language === "en" ? "Cancel" : "Hủy"}
        </Button>
        <Button onClick={handleSave} className="cursor-pointer gap-2">
          <Save className="w-4 h-4" />
          {language === "en" ? "Save Settings" : "Lưu cài đặt"}
        </Button>
      </div>
    </div>
  )
}
