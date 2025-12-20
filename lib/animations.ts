/**
 * Consistent animation configurations for the entire site
 * Use these to ensure smooth, professional animations throughout
 */

export const animationConfig = {
  // Standard durations
  fast: 0.3,
  normal: 0.5,
  slow: 0.7,
  
  // Standard easing
  easing: [0.4, 0, 0.2, 1] as [number, number, number, number], // cubic-bezier
  easingOut: [0.16, 1, 0.3, 1] as [number, number, number, number],
  
  // Standard delays (in seconds)
  delay: {
    none: 0,
    short: 0.1,
    medium: 0.2,
    long: 0.3,
  },
  
  // Standard distances
  distance: {
    small: 15,
    medium: 20,
    large: 30,
  },
}

/**
 * Standard fade-in animation
 */
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: animationConfig.normal, ease: animationConfig.easing },
}

/**
 * Standard slide-up animation
 */
export const slideUp = {
  initial: { opacity: 0, y: animationConfig.distance.medium },
  animate: { opacity: 1, y: 0 },
  transition: { duration: animationConfig.normal, ease: animationConfig.easing },
}

/**
 * Standard slide-up with delay for staggered animations
 */
export const slideUpWithDelay = (index: number = 0) => ({
  initial: { opacity: 0, y: animationConfig.distance.medium },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: animationConfig.normal,
    delay: index * animationConfig.delay.short,
    ease: animationConfig.easing,
  },
})

/**
 * Standard scale-in animation
 */
export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: animationConfig.fast, ease: animationConfig.easing },
}

/**
 * Hero section specific animations
 */
export const heroAnimations = {
  container: {
    initial: { opacity: 0, y: animationConfig.distance.medium },
    animate: { opacity: 1, y: 0 },
    transition: { duration: animationConfig.slow, ease: animationConfig.easing },
  },
  title: {
    initial: { opacity: 0, y: animationConfig.distance.small },
    animate: { opacity: 1, y: 0 },
    transition: {
      delay: animationConfig.delay.medium,
      duration: animationConfig.slow,
      ease: animationConfig.easing,
    },
  },
  subtitle: {
    initial: { opacity: 0, y: animationConfig.distance.small },
    animate: { opacity: 1, y: 0 },
    transition: {
      delay: animationConfig.delay.medium + animationConfig.delay.short,
      duration: animationConfig.slow,
      ease: animationConfig.easing,
    },
  },
  buttons: {
    initial: { opacity: 0, y: animationConfig.distance.small },
    animate: { opacity: 1, y: 0 },
    transition: {
      delay: animationConfig.delay.medium + animationConfig.delay.short * 2,
      duration: animationConfig.slow,
      ease: animationConfig.easing,
    },
  },
  badges: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: {
      delay: animationConfig.delay.medium + animationConfig.delay.short * 3,
      duration: animationConfig.slow,
      ease: animationConfig.easing,
    },
  },
}

/**
 * Section header animations
 */
export const sectionHeader = {
  initial: { opacity: 0, y: animationConfig.distance.medium },
  animate: { opacity: 1, y: 0 },
  transition: { duration: animationConfig.normal, ease: animationConfig.easing },
}

/**
 * Card grid item animations (for staggered effects)
 */
export const cardItem = (index: number = 0) => ({
  initial: { opacity: 0, y: animationConfig.distance.large },
  animate: { opacity: 1, y: 0 },
  transition: {
    delay: index * animationConfig.delay.short,
    duration: animationConfig.normal,
    ease: animationConfig.easing,
  },
})

