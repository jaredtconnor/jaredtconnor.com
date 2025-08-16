import React from 'react';
import { cn } from '../utils/cn';

interface HeroSectionProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'gradient' | 'minimal';
}

interface HeroTitleProps {
  children: React.ReactNode;
  className?: string;
  gradient?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

interface HeroSubtitleProps {
  children: React.ReactNode;
  className?: string;
}

interface HeroDescriptionProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export function HeroTitle({ 
  children, 
  className, 
  gradient = false, 
  size = 'lg' 
}: HeroTitleProps) {
  const sizes = {
    sm: "text-4xl md:text-5xl",
    md: "text-5xl md:text-6xl",
    lg: "text-6xl md:text-7xl",
    xl: "text-7xl md:text-8xl"
  };

  return (
    <h1 className={cn(
      "font-bold tracking-tight leading-none",
      sizes[size],
      gradient 
        ? "text-gradient" 
        : "text-gray-900 dark:text-white",
      className
    )}>
      {children}
    </h1>
  );
}

export function HeroSubtitle({ children, className }: HeroSubtitleProps) {
  return (
    <h2 className={cn(
      "text-xl md:text-2xl font-medium text-gray-600 dark:text-gray-300 leading-relaxed",
      className
    )}>
      {children}
    </h2>
  );
}

export function HeroDescription({ 
  children, 
  className, 
  maxWidth = 'lg' 
}: HeroDescriptionProps) {
  const widths = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-full"
  };

  return (
    <div className={cn(
      "text-lg text-gray-600 dark:text-gray-300 leading-relaxed",
      widths[maxWidth],
      className
    )}>
      {children}
    </div>
  );
}

export function HeroSection({ 
  children, 
  className, 
  variant = 'default' 
}: HeroSectionProps) {
  const variants = {
    default: "bg-white dark:bg-gray-900",
    gradient: "bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800",
    minimal: ""
  };

  return (
    <section className={cn(
      "relative overflow-hidden",
      variants[variant],
      className
    )}>
      {variant === 'gradient' && (
        <>
          {/* Gradient orbs for visual interest */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-radial from-primary-200/30 to-transparent dark:from-primary-800/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-radial from-accent-purple/20 to-transparent dark:from-accent-purple/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        </>
      )}
      
      <div className="relative z-10">
        {children}
      </div>
    </section>
  );
}

// Hero content wrapper for consistent spacing
interface HeroContentProps {
  children: React.ReactNode;
  className?: string;
  spacing?: 'tight' | 'normal' | 'relaxed';
  alignment?: 'left' | 'center';
}

export function HeroContent({ 
  children, 
  className, 
  spacing = 'normal',
  alignment = 'left' 
}: HeroContentProps) {
  const spacings = {
    tight: "space-y-4",
    normal: "space-y-6",
    relaxed: "space-y-8"
  };

  const alignments = {
    left: "text-left",
    center: "text-center mx-auto"
  };

  return (
    <div className={cn(
      "py-16 md:py-24",
      spacings[spacing],
      alignments[alignment],
      className
    )}>
      {children}
    </div>
  );
}

// Action section for CTAs
interface HeroActionsProps {
  children: React.ReactNode;
  className?: string;
  layout?: 'horizontal' | 'vertical';
}

export function HeroActions({ 
  children, 
  className, 
  layout = 'horizontal' 
}: HeroActionsProps) {
  const layouts = {
    horizontal: "flex flex-col sm:flex-row gap-4",
    vertical: "flex flex-col gap-4"
  };

  return (
    <div className={cn(layouts[layout], className)}>
      {children}
    </div>
  );
}

export type { 
  HeroSectionProps, 
  HeroTitleProps, 
  HeroSubtitleProps, 
  HeroDescriptionProps,
  HeroContentProps,
  HeroActionsProps 
};