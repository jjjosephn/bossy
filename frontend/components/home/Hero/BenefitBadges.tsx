import { CheckCircle } from 'lucide-react';
import React from 'react'

const BenefitBadges = () => {
   const BENEFITS = [
      { text: "100% Anonymous", icon: <CheckCircle className="h-4 w-4 text-primary" /> },
      { text: "Free Access", icon: <CheckCircle className="h-4 w-4 text-primary" /> },
   ]
   
   const BenefitBadge = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
      <div className="flex items-center gap-2 bg-primary/10 dark:bg-primary/15 rounded-full px-4 py-2 transition-all duration-300 hover:bg-primary/20 cursor-pointer">
         {icon}
         <span className="font-medium">{text}</span>
      </div>
   )
   
   return (
      <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-3">
         {BENEFITS.map((benefit, index) => (
            <BenefitBadge key={index} {...benefit} />
         ))}
      </div>
   )
}

export default BenefitBadges