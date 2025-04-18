"use client";

import { useMembership } from "@/hooks/use-membership";
import { SignedIn, SignedOut, SignInButton, useAuth, UserButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { BookMarked } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";

// Get the subscription link from env
const subscriptionLink = process.env.NEXT_PUBLIC_MONTHLY_SUBSCRIPTION_LINK;

export const Header = () => {
  // Get current pathname for active link styling
  const pathname = usePathname();
  const { isPro, loading } = useMembership();
  // Get userId for the checkout link
  const { userId } = useAuth();

  // Add client reference ID to subscription link if user is logged in
  const finalSubscriptionLink = userId && subscriptionLink ? `${subscriptionLink}?client_reference_id=${userId}` : "#";

  // Navigation items
  const navItems = [
    {
      name: "Home",
      href: "/"
    },
    {
      name: "Pricing",
      href: "/pricing"
    },
    {
      name: "Prompts",
      href: "/prompts"
    }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and site name */}
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <BookMarked className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span className="text-lg font-semibold text-gray-900 dark:text-white">Prompt Manager</span>
          </motion.div>

          {/* Navigation */}
          <nav className="flex items-center gap-6">
            {navItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400
                    ${pathname === item.href ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-300"}`}
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}

            <SignedIn>
              <div className="flex items-center gap-2">
                {isPro && !loading && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="px-2 py-1 text-xs font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full"
                  >
                    PRO
                  </motion.span>
                )}
                {/* Show Upgrade button if user is signed in, not pro, and not loading */}
                {!isPro && !loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-none hover:opacity-90"
                    >
                      {/* Link to the Stripe checkout page */}
                      <a
                        href={finalSubscriptionLink}
                        className={finalSubscriptionLink === "#" ? "pointer-events-none opacity-50" : ""}
                      >
                        Upgrade
                      </a>
                    </Button>
                  </motion.div>
                )}
                <UserButton />
              </div>
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal">
                <Button>Sign in</Button>
              </SignInButton>
            </SignedOut>
          </nav>
        </div>
      </div>
    </header>
  );
};
