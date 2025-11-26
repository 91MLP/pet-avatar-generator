import NavBar from '@/components/NavBar'
import HeroSection from '@/components/HeroSection'
import GeneratorForm from '@/components/GeneratorForm'
import FeaturesSection from '@/components/FeaturesSection'
import ExamplesSection from '@/components/ExamplesSection'
import CreditSystemInfo from '@/components/PricingComparison'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* 导航栏 */}
      <NavBar />

      {/* Hero 区域 */}
      <HeroSection />

      {/* 表单区域 */}
      <GeneratorForm />

      {/* 卖点展示 */}
      <FeaturesSection />

      {/* 示例作品 */}
      <ExamplesSection />

      {/* 积分系统说明 */}
      <CreditSystemInfo />

      {/* 页脚 */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 Pet Avatar Generator. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
