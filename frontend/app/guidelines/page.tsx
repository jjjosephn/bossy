"use client"

import React, { useState } from 'react'
import { ChevronDown, ChevronRight, Shield, Users, MessageSquare, AlertTriangle, Mail, CheckCircle } from 'lucide-react'
import Link from 'next/link'

type GuidelineCardProps = {
   icon: React.ComponentType<React.SVGProps<SVGSVGElement>>,
   title: string,
   children: React.ReactNode,
   sectionKey: string,
}
export default function Guidelines() {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const GuidelineCard = ({ icon: Icon, title, children, sectionKey }: GuidelineCardProps) => (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
      <div 
        className="flex items-center justify-between p-6 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-all duration-200"
        onClick={() => toggleSection(sectionKey)}
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-200">
            <Icon className="w-6 h-6 text-gray-700" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        </div>
        {expandedSections[sectionKey] ? 
          <ChevronDown className="w-5 h-5 text-gray-600" /> : 
          <ChevronRight className="w-5 h-5 text-gray-600" />
        }
      </div>
      {expandedSections[sectionKey] && (
        <div className="p-6 animate-in slide-in-from-top-2 duration-200">
          {children}
        </div>
      )}
    </div>
  )

  const GuidelineItem = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-150">
      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
      <div className="text-gray-700 leading-relaxed">{children}</div>
    </div>
  )

  const ProhibitedItem = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-red-50 transition-colors duration-150">
      <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
      <div className="text-gray-700 leading-relaxed">{children}</div>
    </div>
  )

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="inline-flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2 mb-6">
          <Shield className="w-5 h-5 text-gray-700" />
          <span className="text-gray-700 font-medium">Community Guidelines</span>
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Bossy Site Guidelines
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Creating a safe, respectful, and constructive community for workplace feedback and reviews
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-16">
        <div className="bg-white rounded-xl shadow-xl p-8 mb-8 border border-gray-200">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-gray-100 rounded-lg">
              <MessageSquare className="w-7 h-7 text-gray-700" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">About Bossy</h2>
          </div>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            Bossy provides a platform where users can share honest feedback, reviews, and ratings about higher-ups such as managers, leads, supervisors, and companies they have worked at. Our mission is to create a safe, respectful, and constructive community to help people make informed decisions about their workplaces.
          </p>
          <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-gray-400">
            <h3 className="font-semibold text-gray-800 mb-2">How It Works</h3>
            <p className="text-gray-600">
              Users generate content by submitting anonymous reviews and ratings of higher-ups and companies based on their own experiences. We do not proactively add profiles or content—everything is submitted by our user community.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <GuidelineCard 
            icon={Users} 
            title="Guidelines for Users" 
            sectionKey="users"
          >
            <div className="space-y-2">
              <GuidelineItem>
                <strong>Be honest and respectful.</strong> Provide truthful and constructive feedback without personal attacks or offensive language.
              </GuidelineItem>
              <GuidelineItem>
                <strong>Focus reviews on your experience with the higher-up or company.</strong> Avoid commentary unrelated to professional behavior or workplace environment.
              </GuidelineItem>
              <GuidelineItem>
                <strong>One review per higher-up or company.</strong> To maintain fairness, only one review or rating per individual or company is allowed per user.
              </GuidelineItem>
              <GuidelineItem>
                <strong>Avoid spam and self-promotion.</strong> Promotional or irrelevant content will be removed.
              </GuidelineItem>
              <GuidelineItem>
                <strong>Do not share private or identifying information.</strong> Protect privacy at all times; reviews are anonymous.
              </GuidelineItem>
              <GuidelineItem>
                <strong>Use English only.</strong> Unless otherwise specified for a particular locale.
              </GuidelineItem>
            </div>
          </GuidelineCard>

          <GuidelineCard 
            icon={Shield} 
            title="Guidelines for Higher-Ups" 
            sectionKey="higherups"
          >
            <div className="space-y-2">
              <GuidelineItem>
                <strong>Reviews are anonymous.</strong> Bossy does not provide any personal information about the submitters of reviews.
              </GuidelineItem>
              <GuidelineItem>
                <strong>Profiles are user-submitted.</strong> We do not proactively add profiles of higher-ups or companies; all profiles come from our community.
              </GuidelineItem>
              <GuidelineItem>
                <strong>Negative reviews are not removed.</strong> Reviews are only removed if they violate site guidelines.
              </GuidelineItem>
              <GuidelineItem>
                <strong>Respectful engagement is encouraged.</strong> Replies or comments fueled by anger or profanity may be removed.
              </GuidelineItem>
              <GuidelineItem>
                <strong>Moderators do not arbitrate facts.</strong> They cannot verify or dispute details in reviews.
              </GuidelineItem>
              <GuidelineItem>
                <strong>If you suspect spam or unfair targeting,</strong> please send us a <Link href='/feedback' className="text-blue-600 hover:text-blue-800 underline font-medium">feedback</Link>. We will review the situation.
              </GuidelineItem>
              <GuidelineItem>
                <strong>Higher-ups should not rate themselves.</strong> We encourage managers and leads to foster an open culture and invite genuine feedback from their teams.
              </GuidelineItem>
            </div>
          </GuidelineCard>

          <GuidelineCard 
            icon={AlertTriangle} 
            title="Prohibited Content" 
            sectionKey="prohibited"
          >
            <div className="mb-4">
              <p className="text-gray-600 mb-4">Content containing the following will be removed:</p>
            </div>
            <div className="space-y-2">
              <ProhibitedItem>Profanity, hate speech, harassment, or discriminatory remarks</ProhibitedItem>
              <ProhibitedItem>Personal attacks, threats, or bullying</ProhibitedItem>
              <ProhibitedItem>Private or sensitive information about any individual</ProhibitedItem>
              <ProhibitedItem>False claims or defamatory statements</ProhibitedItem>
              <ProhibitedItem>Spam, irrelevant links, or advertisements</ProhibitedItem>
              <ProhibitedItem>Content that violates any laws or intellectual property rights</ProhibitedItem>
            </div>
          </GuidelineCard>

          <GuidelineCard 
            icon={Shield} 
            title="Moderation Notes" 
            sectionKey="moderation"
          >
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-gray-500">
                <h4 className="font-semibold text-gray-800 mb-2">Moderation</h4>
                <p className="text-gray-600 mb-2">
                  Bossy employs moderators who review content to ensure compliance with these guidelines. Moderators may remove or edit content that violates rules. Content is not removed simply for being negative if it complies with guidelines.
                </p>
                <p className="text-gray-600">
                  We reserve the right to remove or restrict any content or accounts violating these guidelines.
                </p>
              </div>
              
            </div>
          </GuidelineCard>
        </div>

        {/* <div className="mt-8 bg-white rounded-xl shadow-xl border border-gray-200 p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gray-100 rounded-full">
              <Mail className="w-8 h-8 text-gray-700" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Need Help?</h2>
          <p className="text-lg mb-6 text-gray-600">
            For questions or to report abuse, please contact our support team
          </p>
          <a 
            href="mailto:support@bossy.com" 
            className="inline-flex items-center space-x-2 bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-200 shadow-lg"
          >
            <Mail className="w-5 h-5" />
            <span>support@bossy.com</span>
          </a>
        </div> */}
      </div>
    </div>
  )
}