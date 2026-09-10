"use server";

import { addKnowledge } from "@/lib/chatbot";

/**
 * Seed the knowledge base with course and matching information
 */
export async function seedKnowledgeBase() {
  const knowledgeEntries = [
    // Course Information
    {
      title: "Available Courses",
      content: `We offer various courses on Islamic marriage, family life, and personal development:

- Marriage Preparation Course: A comprehensive program covering Islamic principles of marriage, communication skills, and relationship building
- Communication in Marriage: Learn effective communication techniques based on Islamic teachings
- Financial Planning for Couples: Understanding Islamic finance and managing household finances
- Conflict Resolution: Islamic approaches to resolving marital disputes
- Parenting Basics: Preparing for parenthood with Islamic guidance

All courses are taught by qualified instructors and include interactive sessions, Q&A, and practical exercises.`,
      type: "course",
    },
    {
      title: "Course Enrollment Process",
      content: `To enroll in a course:

1. Browse available courses on the Courses page
2. Click on a course to view detailed information
3. Click "Enroll" button if you're logged in
4. Complete the enrollment form
5. You'll receive confirmation and access to course materials

Course fees vary by program. Some courses offer scholarships for those in need. Contact us for more information about financial assistance.`,
      type: "course",
    },
    {
      title: "Course Duration and Format",
      content: `Course formats:

- Online: Self-paced video lessons with weekly live Q&A sessions
- In-person: Weekend workshops at our community center
- Hybrid: Combination of online materials and in-person sessions

Most courses run for 4-8 weeks with 1-2 hours of content per week. You'll have lifetime access to course materials after completion.`,
      type: "course",
    },

    // Marriage Matching Information
    {
      title: "Marriage Matching Process",
      content: `Our Islamic marriage matching service helps Muslims find compatible spouses:

1. Create Profile: Complete your marriage profile with information about yourself, values, and preferences
2. Verification: Our team verifies your profile to ensure authenticity
3. AI Matching: Our advanced AI system suggests compatible matches based on:
   - Shared religious values and practices
   - Educational and professional backgrounds
   - Family values and expectations
   - Life goals and marriage intentions
4. Connect: View suggested matches and send connection requests
5. Communicate: Chat with matches through our secure platform with wali/mahram oversight options

All interactions are conducted with Islamic guidelines and proper adab (etiquette).`,
      type: "matching",
    },
    {
      title: "Profile Creation Guidelines",
      content: `When creating your marriage profile:

- Be honest and authentic in your description
- Clearly state your religious practices and commitment level
- Describe your personality, interests, and values
- Share your expectations for marriage and family life
- Specify your education and occupation
- Set realistic preferences for age, education, and location

Your profile should reflect who you truly are. Remember, the goal is to find someone compatible for a lifelong partnership.`,
      type: "matching",
    },
    {
      title: "Safety and Privacy",
      content: `We take your safety and privacy seriously:

- All profiles are manually verified by our team
- Personal contact information is never shared publicly
- Communication happens through our secure platform
- You control who can see your profile and contact you
- Report any inappropriate behavior immediately
- Option to involve wali/guardian in communications

We follow Islamic principles of modesty and propriety in all interactions.`,
      type: "matching",
    },
    {
      title: "Matching Criteria Explained",
      content: `Our AI matching system considers:

1. Religious Compatibility: Prayer habits, Quran recitation, Islamic knowledge level
2. Values & Goals: Family values, life priorities, marriage intentions
3. Background: Education, profession, cultural background
4. Preferences: Age range, location, educational level
5. Personality: Based on bio and communication style

The system gives you a compatibility score (0-100%) showing how well you match with each profile. Higher scores indicate stronger compatibility across these dimensions.`,
      type: "matching",
    },

    // General FAQs
    {
      title: "Platform Mission and Values",
      content: `Our platform is dedicated to helping Muslims:

- Find compatible marriage partners in a halal, respectful manner
- Learn about Islamic marriage and family life through quality education
- Build strong, lasting relationships based on Islamic principles
- Access resources and support for married couples

We operate according to Quran, Sunnah, and the guidance of qualified Islamic scholars. Our team includes marriage counselors, Islamic scholars, and technology experts.`,
      type: "general",
    },
    {
      title: "Contact and Support",
      content: `Need help?

- Email: support@example.com
- Phone: Available on Contact page
- Live Chat: Use this chatbot for immediate assistance
- Office Hours: Sunday-Thursday, 9 AM - 5 PM

For urgent matters regarding profile verification or safety concerns, contact us immediately through any channel.`,
      type: "general",
    },
    // More Course Details
    {
      title: "Course Instructors and Credentials",
      content: `Our instructors are:

- Qualified Islamic scholars with degrees from recognized institutions
- Experienced marriage counselors with professional certifications
- Community leaders with years of practical experience
- Vetted by our academic board for knowledge and teaching ability

All courses undergo quality review to ensure they meet Islamic standards and provide practical, actionable guidance for students.`,
      type: "course",
    },
    {
      title: "Course Certificates and Completion",
      content: `Upon completing a course, you will receive:

- Digital certificate of completion
- Downloadable course materials for future reference
- Access to alumni community for continued support
- Opportunity to enroll in advanced courses

Completion requirements:
- Watch all video lessons
- Participate in live Q&A sessions (if applicable)
- Complete quizzes and assignments
- Submit final project or reflection (for some courses)`,
      type: "course",
    },

    // Marriage Matching FAQs
    {
      title: "Profile Verification Process",
      content: `Profile verification ensures authenticity and safety:

1. Identity Verification: Government-issued ID check
2. Email & Phone Verification: Confirm contact information
3. Profile Review: Our team reviews all information for appropriateness
4. Optional Background Check: Available for premium members
5. Verification Badge: Verified profiles receive a special badge

Verification typically takes 24-48 hours. If there are any issues, we'll contact you via email.`,
      type: "matching",
    },
    {
      title: "Communication Guidelines",
      content: `Islamic guidelines for respectful communication:

- Always maintain modesty and respect
- Involve wali/guardian as per Islamic guidance
- Focus on getting to know each other for marriage purposes
- Avoid inappropriate topics or requests
- Use the platform's messaging system (no sharing of personal contact info initially)
- Be honest and sincere in your intentions

Report any violations of these guidelines immediately to our support team.`,
      type: "matching",
    },
    {
      title: "Subscription and Pricing",
      content: `Platform access options:

Free Tier:
- Create and maintain profile
- View up to 5 match suggestions per month
- Basic course access

Premium Membership ($29.99/month):
- Unlimited match suggestions
- Priority customer support
- Advanced filtering options
- Background check services
- Full access to all courses
- Early access to new features

We also offer scholarships for those facing financial hardship. Contact us for more information.`,
      type: "general",
    },
    {
      title: "Success Stories and Testimonials",
      content: `Many couples have found their life partners through our platform:

"The AI matching helped us discover we had so much in common beyond what we initially looked for. Alhamdulillah, we've been married for 2 years now!" - Sarah & Ahmed

"The courses prepared us well for marriage. We learned communication skills and Islamic principles that strengthened our relationship from the start." - Fatima & Omar

Our success rate: Over 500 successful marriages facilitated through the platform, with 85% of couples reporting high satisfaction with their match.`,
      type: "general",
    },
    {
      title: "Troubleshooting Common Issues",
      content: `Common issues and solutions:

**Can't log in?**
- Reset your password using the "Forgot Password" link
- Clear browser cache and cookies
- Try a different browser

**Not receiving match suggestions?**
- Ensure your profile is complete (80%+ completion required)
- Verify your profile is marked as "Active"
- Check that you've set your preferences
- Contact support if problem persists

**Messages not sending?**
- Check your internet connection
- Ensure you haven't been blocked by the recipient
- Verify chat is enabled for the match

For technical issues, email support@example.com with screenshots and  details.`,
      type: "faq",
    },
    {
      title: "Privacy and Data Protection",
      content: `We take your privacy seriously:

- Your data is encrypted and securely stored
- We never sell your information to third parties
- You control who can see your profile
- Option to hide profile temporarily or permanently
- Right to request data deletion at any time
- Compliant with GDPR and international privacy standards

You can review our full Privacy Policy in your account settings or at www.example.com/privacy`,
      type: "general",
    },
  ];

  console.log("Seeding knowledge base...");
  const results = {
    added: 0,
    failed: 0,
    errors: [] as string[],
  };

  for (const entry of knowledgeEntries) {
    try {
      const result = await addKnowledge(entry);
      if (result.success) {
        results.added++;
      } else {
        results.failed++;
        results.errors.push(`${entry.title}: ${result.error}`);
      }
    } catch (error: any) {
      results.failed++;
      results.errors.push(`${entry.title}: ${error.message}`);
    }
  }

  console.log(
    `Knowledge base seeding complete! Added: ${results.added}, Failed: ${results.failed}`,
  );

  return {
    success: results.failed === 0,
    data: results,
  };
}
