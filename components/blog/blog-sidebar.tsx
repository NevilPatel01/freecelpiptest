"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calculator, BookOpen, TrendingUp } from "lucide-react"

export function BlogSidebar() {
  return (
    <aside className="hidden xl:block w-64 border-l border-border/50 bg-background/50 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
      <nav className="p-4 space-y-6">
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
            <span>🛠️</span>
            Useful Tools
          </h3>
          <div className="space-y-3">
            <Link href="/celpip-score-calculator" className="block">
              <Card className="card-hover card-elevated cursor-pointer transition-all duration-200 hover:shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0 shadow-md">
                      <Calculator className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-sm font-semibold mb-1">Score Calculator</CardTitle>
                      <CardDescription className="text-xs leading-relaxed">
                        Calculate your CELPIP score and CLB level
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
            
            <Link href="/vocabulary-level-grader" className="block">
              <Card className="card-hover card-elevated cursor-pointer transition-all duration-200 hover:shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg gradient-reading flex items-center justify-center flex-shrink-0 shadow-md">
                      <BookOpen className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-sm font-semibold mb-1">Vocabulary Grader</CardTitle>
                      <CardDescription className="text-xs leading-relaxed">
                        Test your vocabulary level
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>
      </nav>
    </aside>
  )
}

