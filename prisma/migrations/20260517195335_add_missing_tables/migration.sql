-- CreateTable
CREATE TABLE "NavigationMenu" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "href" TEXT,
    "isOpenNewTab" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "showInHeader" BOOLEAN NOT NULL DEFAULT true,
    "showInFooter" BOOLEAN NOT NULL DEFAULT true,
    "icon" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NavigationMenu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NavigationSubItem" (
    "id" TEXT NOT NULL,
    "menuId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "href" TEXT NOT NULL,
    "isOpenNewTab" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "icon" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NavigationSubItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomepageSection" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT,
    "body" TEXT,
    "ctaLabel" TEXT,
    "ctaHref" TEXT,
    "mediaUrl" TEXT,
    "mediaAlt" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomepageSection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NavigationMenu_name_key" ON "NavigationMenu"("name");

-- CreateIndex
CREATE INDEX "NavigationMenu_order_idx" ON "NavigationMenu"("order");

-- CreateIndex
CREATE INDEX "NavigationSubItem_menuId_idx" ON "NavigationSubItem"("menuId");

-- CreateIndex
CREATE INDEX "NavigationSubItem_order_idx" ON "NavigationSubItem"("order");

-- CreateIndex
CREATE UNIQUE INDEX "NavigationSubItem_menuId_name_key" ON "NavigationSubItem"("menuId", "name");

-- CreateIndex
CREATE INDEX "HomepageSection_type_idx" ON "HomepageSection"("type");

-- CreateIndex
CREATE INDEX "HomepageSection_order_idx" ON "HomepageSection"("order");

-- AddForeignKey
ALTER TABLE "NavigationSubItem" ADD CONSTRAINT "NavigationSubItem_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "NavigationMenu"("id") ON DELETE CASCADE ON UPDATE CASCADE;
