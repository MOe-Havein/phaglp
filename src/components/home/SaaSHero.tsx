<div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-tartorange/20 via-transparent to-transparent dark:from-tartorange/10" />
<div className="container mx-auto text-center max-w-4xl relative">
  <Badge className="mb-4 bg-perfectsky/10 text-perfectsky hover:bg-perfectsky/15 border-perfectsky/20 transition-all duration-300 hover:scale-105">
    phaglp - Philosophical Platform
  </Badge>
  
  <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance bg-gradient-to-r from-perfectsky via-tartorange to-celebration bg-clip-text text-transparent drop-shadow-sm">
    THE PHILOSOPHICAL ACADEMY FOR GENIUSES LIFE PLANNING
  </h1>
  
  <p className="text-xl text-platinum mb-8 leading-relaxed text-pretty max-w-2xl mx-auto">
    A modern application for philosophical education.
  </p>
  
  <div className="flex flex-col sm:flex-row gap-4 justify-center">
    <Button
      size="lg"
      className="bg-perfectsky text-frost hover:bg-perfectsky/90 shadow-lg shadow-perfectsky/25 transition-all hover:scale-105 active:scale-95"
      asChild
    >
      <Link href="/courses">
        Explore Courses <ArrowRight className="ml-2 w-4 h-4" />
      </Link>
    </Button>
    
    <Button
      size="lg"
      variant="outline"
      asChild
      className="border-platinum/30 text-platinum hover:bg-platinum/10 bg-transparent transition-all hover:scale-105 active:scale-95"
    >
      <Link href="/lectures">Read Lectures</Link>
    </Button>
  </div>
</div>
