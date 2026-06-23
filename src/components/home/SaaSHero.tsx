 <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-100/40 via-background to-transparent dark:from-blue-950/20" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-orange-100/20 via-transparent to-transparent dark:from-orange-950/10" />
        <div className="container mx-auto text-center max-w-4xl relative">
          <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/15 border-primary/20 transition-all duration-300 hover:scale-105">
            phaglp - Philosophical Platform
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance bg-gradient-to-r from-primary via-blue-600 to-primary bg-clip-text text-transparent">
            THE PHILOSOPHICAL ACADEMY FOR GENIUSES LIFE PLANNING
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed text-pretty max-w-2xl mx-auto">
            A modern application for philosophical education.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-accent text-white hover:bg-accent/90 shadow-lg shadow-orange-500/20 transition-all hover:scale-105 active:scale-95"
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
              className="border-primary/30 text-primary hover:bg-primary/5 bg-transparent transition-all hover:scale-105 active:scale-95"
            >
              <Link href="/lectures">Read Lectures</Link>
            </Button>
          </div>
        </div>
       
