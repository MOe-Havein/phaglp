"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  createMenu,
  updateMenu,
  deleteMenu,
  createSubItem,
  updateSubItem,
  deleteSubItem,
  reorderMenus,
  reorderSubItems,
} from "@/lib/menu-actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowUp,
  ArrowDown,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  ChevronRight,
  FolderOpen,
  Info,
} from "lucide-react";
import * as Icons from "lucide-react";

function MenuIcon({
  name,
  className,
}: {
  name: string | null;
  className?: string;
}) {
  if (!name) return <Icons.Menu className={className} />;
  const IconComponent = (Icons as any)[name];
  if (!IconComponent) return <Icons.Globe className={className} />;
  return <IconComponent className={className} />;
}

interface SubItem {
  id: string;
  menuId: string;
  name: string;
  href: string;
  order: number;
  isOpenNewTab: boolean;
  isActive: boolean;
  icon: string | null;
}

interface Menu {
  id: string;
  name: string;
  href: string | null;
  order: number;
  isOpenNewTab: boolean;
  isActive: boolean;
  showInHeader: boolean;
  showInFooter: boolean;
  icon: string | null;
  items: SubItem[];
}

interface PageItem {
  id: string;
  title: string;
  slug: string;
}

interface MenuManagerProps {
  initialMenus: Menu[];
  pages: PageItem[];
}

export function MenuManager({ initialMenus, pages }: MenuManagerProps) {
  const router = useRouter();
  const [menus, setMenus] = useState<Menu[]>(initialMenus);
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(
    initialMenus[0]?.id ?? null,
  );
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync state with props
  useEffect(() => {
    setMenus(initialMenus);
    if (selectedMenuId && !initialMenus.some((m) => m.id === selectedMenuId)) {
      setSelectedMenuId(initialMenus[0]?.id ?? null);
    } else if (!selectedMenuId && initialMenus.length > 0) {
      setSelectedMenuId(initialMenus[0]?.id ?? null);
    }
  }, [initialMenus]);

  // Dialog states for Create Menu
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [newMenuName, setNewMenuName] = useState("");
  const [newMenuHref, setNewMenuHref] = useState("");
  const [newMenuIcon, setNewMenuIcon] = useState("Folder");
  const [newMenuOpenNewTab, setNewMenuOpenNewTab] = useState(false);
  const [newMenuShowInHeader, setNewMenuShowInHeader] = useState(true);
  const [newMenuShowInFooter, setNewMenuShowInFooter] = useState(true);
  const [newMenuIsPage, setNewMenuIsPage] = useState(false);

  // Dialog states for Edit Menu
  const [isEditMenuOpen, setIsEditMenuOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [editMenuIsPage, setEditMenuIsPage] = useState(false);

  // Dialog states for Create SubItem
  const [isCreateSubOpen, setIsCreateSubOpen] = useState(false);
  const [subName, setSubName] = useState("");
  const [subHref, setSubHref] = useState("");
  const [subIcon, setSubIcon] = useState("");
  const [subOpenNewTab, setSubOpenNewTab] = useState(false);
  const [newSubIsPage, setNewSubIsPage] = useState(false);

  // Dialog states for Edit SubItem
  const [isEditSubOpen, setIsEditSubOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<SubItem | null>(null);
  const [editSubIsPage, setEditSubIsPage] = useState(false);

  const selectedMenu = menus.find((m) => m.id === selectedMenuId) || null;

  const handleAction = async (
    actionFn: () => Promise<any>,
    successCallback?: () => void,
  ) => {
    setErrorMessage(null);
    startTransition(async () => {
      try {
        const res = await actionFn();
        if (res.success) {
          router.refresh();
          if (successCallback) successCallback();
        } else {
          setErrorMessage(res.error || "Action failed");
        }
      } catch (err: any) {
        setErrorMessage(err.message || "An unexpected error occurred");
      }
    });
  };

  const moveMenuUp = (index: number) => {
    if (index === 0) return;
    const newMenus = [...menus];
    const temp = newMenus[index];
    const prev = newMenus[index - 1];
    if (temp !== undefined && prev !== undefined) {
      newMenus[index] = prev;
      newMenus[index - 1] = temp;

      setMenus(newMenus);
      const ids = newMenus.map((m) => m.id);
      handleAction(() => reorderMenus(ids));
    }
  };

  const moveMenuDown = (index: number) => {
    if (index === menus.length - 1) return;
    const newMenus = [...menus];
    const temp = newMenus[index];
    const next = newMenus[index + 1];
    if (temp !== undefined && next !== undefined) {
      newMenus[index] = next;
      newMenus[index + 1] = temp;

      setMenus(newMenus);
      const ids = newMenus.map((m) => m.id);
      handleAction(() => reorderMenus(ids));
    }
  };

  const moveSubUp = (menuIndex: number, subIndex: number) => {
    if (subIndex === 0) return;
    const newMenus = [...menus];
    const menu = newMenus[menuIndex];
    if (!menu) return;
    const items = [...menu.items];
    const temp = items[subIndex];
    const prev = items[subIndex - 1];
    if (temp !== undefined && prev !== undefined) {
      items[subIndex] = prev;
      items[subIndex - 1] = temp;
      menu.items = items;

      setMenus(newMenus);
      const ids = items.map((item) => item.id);
      handleAction(() => reorderSubItems(ids));
    }
  };

  const moveSubDown = (menuIndex: number, subIndex: number) => {
    const newMenus = [...menus];
    const menu = newMenus[menuIndex];
    if (!menu) return;
    const items = [...menu.items];
    if (subIndex === items.length - 1) return;
    const temp = items[subIndex];
    const next = items[subIndex + 1];
    if (temp !== undefined && next !== undefined) {
      items[subIndex] = next;
      items[subIndex + 1] = temp;
      menu.items = items;

      setMenus(newMenus);
      const ids = items.map((item) => item.id);
      handleAction(() => reorderSubItems(ids));
    }
  };

  const handleCreateMenu = () => {
    if (!newMenuName) return;
    handleAction(
      () =>
        createMenu({
          name: newMenuName,
          href: newMenuHref || null,
          icon: newMenuIcon || "Folder",
          isOpenNewTab: newMenuOpenNewTab,
          showInHeader: newMenuShowInHeader,
          showInFooter: newMenuShowInFooter,
          isActive: true,
        }),
      () => {
        setIsCreateMenuOpen(false);
        setNewMenuName("");
        setNewMenuHref("");
        setNewMenuIcon("Folder");
        setNewMenuOpenNewTab(false);
        setNewMenuShowInHeader(true);
        setNewMenuShowInFooter(true);
        setNewMenuIsPage(false);
        router.refresh();
      },
    );
  };

  const handleUpdateMenu = () => {
    if (!editingMenu) return;
    handleAction(
      () =>
        updateMenu(editingMenu.id, {
          name: editingMenu.name,
          href: editingMenu.href || null,
          icon: editingMenu.icon,
          isOpenNewTab: editingMenu.isOpenNewTab,
          showInHeader: editingMenu.showInHeader,
          showInFooter: editingMenu.showInFooter,
          isActive: editingMenu.isActive,
        }),
      () => {
        setIsEditMenuOpen(false);
        setEditingMenu(null);
      },
    );
  };

  const toggleMenuState = (menu: Menu, active: boolean) => {
    handleAction(() => updateMenu(menu.id, { isActive: active }));
  };

  const toggleMenuHeader = (menu: Menu, visible: boolean) => {
    handleAction(() => updateMenu(menu.id, { showInHeader: visible }));
  };

  const toggleMenuFooter = (menu: Menu, visible: boolean) => {
    handleAction(() => updateMenu(menu.id, { showInFooter: visible }));
  };

  const handleDeleteMenu = (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this navigation category? This will delete all sub-items inside it.",
      )
    )
      return;
    handleAction(() => deleteMenu(id));
  };

  const handleCreateSub = () => {
    if (!selectedMenu || !subName || !subHref) return;
    handleAction(
      () =>
        createSubItem(selectedMenu.id, {
          name: subName,
          href: subHref,
          icon: subIcon || null,
          isOpenNewTab: subOpenNewTab,
          isActive: true,
        }),
      () => {
        setIsCreateSubOpen(false);
        setSubName("");
        setSubHref("");
        setSubIcon("");
        setSubOpenNewTab(false);
        setNewSubIsPage(false);
      },
    );
  };

  const handleUpdateSub = () => {
    if (!editingSub) return;
    handleAction(
      () =>
        updateSubItem(editingSub.id, {
          name: editingSub.name,
          href: editingSub.href,
          icon: editingSub.icon,
          isOpenNewTab: editingSub.isOpenNewTab,
          isActive: editingSub.isActive,
        }),
      () => {
        setIsEditSubOpen(false);
        setEditingSub(null);
      },
    );
  };

  const toggleSubState = (sub: SubItem, active: boolean) => {
    handleAction(() => updateSubItem(sub.id, { isActive: active }));
  };

  const handleDeleteSub = (id: string) => {
    if (!confirm("Delete this sub-menu item?")) return;
    handleAction(() => deleteSubItem(id));
  };

  return (
    <div className="space-y-6">
      {errorMessage && (
        <div className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 p-4 rounded-xl border border-red-200 dark:border-red-900/30 text-sm font-medium flex items-center gap-2">
          <Info className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 space-y-4">
          <Card className="border-primary/10 shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div>
                <CardTitle className="text-lg">Navigation Menus</CardTitle>
                <CardDescription>
                  Drag-free sorting & structural control
                </CardDescription>
              </div>
              <Dialog
                open={isCreateMenuOpen}
                onOpenChange={setIsCreateMenuOpen}
              >
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1 shadow-sm rounded-xl">
                    <Plus className="w-4 h-4" /> Add Menu
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-2xl border-primary/10 max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create Menu Category</DialogTitle>
                    <DialogDescription>
                      Add a main category to the header navigation.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="menuName">Category Name</Label>
                      <Input
                        id="menuName"
                        placeholder="e.g. Services, About Us"
                        value={newMenuName}
                        onChange={(e) => setNewMenuName(e.target.value)}
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Link Type</Label>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant={!newMenuIsPage ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              setNewMenuIsPage(false);
                              setNewMenuHref("");
                            }}
                            className="w-full text-xs rounded-xl"
                          >
                            Custom URL
                          </Button>
                          <Button
                            type="button"
                            variant={newMenuIsPage ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              setNewMenuIsPage(true);
                              if (pages.length > 0) {
                                setNewMenuHref(`/${pages[0]?.slug || ""}`);
                              }
                            }}
                            className="w-full text-xs rounded-xl"
                          >
                            Dynamic Page
                          </Button>
                        </div>
                      </div>

                      {newMenuIsPage ? (
                        <div className="space-y-1.5">
                          <Label htmlFor="menuPageSelect">Select Page</Label>
                          <Select
                            value={
                              pages.find((p) => `/${p.slug}` === newMenuHref)
                                ?.slug || ""
                            }
                            onValueChange={(val) => setNewMenuHref(`/${val}`)}
                          >
                            <SelectTrigger
                              id="menuPageSelect"
                              className="rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200"
                            >
                              <SelectValue placeholder="Choose a page..." />
                            </SelectTrigger>
                            <SelectContent>
                              {pages.map((p) => (
                                <SelectItem key={p.id} value={p.slug}>
                                  {p.title} (/{p.slug})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <Label htmlFor="menuHref">
                            Direct URL / Path (Optional)
                          </Label>
                          <Input
                            id="menuHref"
                            placeholder="e.g. /contact (leave blank for dropdown menu)"
                            value={newMenuHref}
                            onChange={(e) => setNewMenuHref(e.target.value)}
                          />
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="menuIcon">Lucide Icon Name</Label>
                      <Input
                        id="menuIcon"
                        placeholder="e.g. Cpu, BookOpen, GraduationCap, Share2"
                        value={newMenuIcon}
                        onChange={(e) => setNewMenuIcon(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <Label
                        htmlFor="menuNewTab"
                        className="cursor-pointer text-xs"
                      >
                        Open in New Tab?
                      </Label>
                      <Switch
                        id="menuNewTab"
                        checked={newMenuOpenNewTab}
                        onCheckedChange={setNewMenuOpenNewTab}
                      />
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <Label
                        htmlFor="menuShowInHeader"
                        className="cursor-pointer text-xs"
                      >
                        Show in Navbar Header?
                      </Label>
                      <Switch
                        id="menuShowInHeader"
                        checked={newMenuShowInHeader}
                        onCheckedChange={setNewMenuShowInHeader}
                      />
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <Label
                        htmlFor="menuShowInFooter"
                        className="cursor-pointer text-xs"
                      >
                        Show in Footer Link List?
                      </Label>
                      <Switch
                        id="menuShowInFooter"
                        checked={newMenuShowInFooter}
                        onCheckedChange={setNewMenuShowInFooter}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateMenuOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateMenu}
                      disabled={!newMenuName || isPending}
                    >
                      {isPending ? "Creating..." : "Create Category"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {menus.map((menu, index) => {
                  const isSelected = menu.id === selectedMenuId;
                  return (
                    <div
                      key={menu.id}
                      onClick={() => setSelectedMenuId(menu.id)}
                      className={`p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-all ${
                        isSelected
                          ? "bg-slate-50 dark:bg-slate-900 border-l-2 border-primary"
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`p-2 rounded-lg border ${
                            isSelected
                              ? "bg-primary text-white border-transparent"
                              : "bg-slate-50 dark:bg-slate-800 text-muted-foreground border-slate-100 dark:border-slate-800"
                          }`}
                        >
                          <MenuIcon name={menu.icon} className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-sm truncate flex items-center gap-1.5 text-foreground">
                            {menu.name}
                            {menu.href && (
                              <span className="text-[10px] text-muted-foreground bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded flex items-center gap-0.5">
                                link <ExternalLink className="w-2.5 h-2.5" />
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2">
                            <span>Order: {menu.order}</span>
                            <span>•</span>
                            <span>{menu.items.length} sub-items</span>
                          </div>
                        </div>
                      </div>

                      <div
                        className="flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-7 h-7 text-muted-foreground hover:text-foreground"
                          disabled={index === 0 || isPending}
                          onClick={() => moveMenuUp(index)}
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-7 h-7 text-muted-foreground hover:text-foreground"
                          disabled={index === menus.length - 1 || isPending}
                          onClick={() => moveMenuDown(index)}
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-7 h-7 text-blue-600 hover:text-blue-700"
                          onClick={() => {
                            setEditingMenu(menu);
                            const isPage = menu.href
                              ? pages.some((p) => `/${p.slug}` === menu.href)
                              : false;
                            setEditMenuIsPage(isPage);
                            setIsEditMenuOpen(true);
                          }}
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-7 h-7 text-red-500 hover:text-red-600"
                          disabled={isPending}
                          onClick={() => handleDeleteMenu(menu.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  );
                })}

                {menus.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground text-sm">
                    No custom menus created yet.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7">
          {selectedMenu ? (
            <Card className="border-primary/10 shadow-sm">
              <CardHeader className="border-b pb-4 flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-primary/10 text-primary border border-primary/20 rounded-xl">
                    <MenuIcon name={selectedMenu.icon} className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      Category: {selectedMenu.name}
                    </CardTitle>
                    <CardDescription>
                      {selectedMenu.href
                        ? `Points directly to URL: ${selectedMenu.href}`
                        : "Dropdown parent group containing sub-items"}
                    </CardDescription>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 border px-2 py-1 rounded-xl shadow-sm text-xs">
                    <span className="font-semibold text-[10px] uppercase text-muted-foreground tracking-wider">
                      Active
                    </span>
                    <Switch
                      checked={selectedMenu.isActive}
                      className="scale-75"
                      onCheckedChange={(checked) =>
                        toggleMenuState(selectedMenu, checked)
                      }
                    />
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 border px-2 py-1 rounded-xl shadow-sm text-xs">
                    <span className="font-semibold text-[10px] uppercase text-muted-foreground tracking-wider">
                      Header
                    </span>
                    <Switch
                      checked={selectedMenu.showInHeader}
                      className="scale-75"
                      onCheckedChange={(checked) =>
                        toggleMenuHeader(selectedMenu, checked)
                      }
                    />
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 border px-2 py-1 rounded-xl shadow-sm text-xs">
                    <span className="font-semibold text-[10px] uppercase text-muted-foreground tracking-wider">
                      Footer
                    </span>
                    <Switch
                      checked={selectedMenu.showInFooter}
                      className="scale-75"
                      onCheckedChange={(checked) =>
                        toggleMenuFooter(selectedMenu, checked)
                      }
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-sm tracking-wide uppercase text-muted-foreground flex items-center gap-1.5">
                    <FolderOpen className="w-4 h-4 text-primary" />
                    Submenu Items ({selectedMenu.items.length})
                  </h3>
                  <Dialog
                    open={isCreateSubOpen}
                    onOpenChange={setIsCreateSubOpen}
                  >
                    <DialogTrigger asChild>
                      <Button size="sm" className="gap-1 shadow-sm rounded-xl">
                        <Plus className="w-4 h-4" /> Add Sub-Item
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-2xl border-primary/10 max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add Sub-Item Link</DialogTitle>
                        <DialogDescription>
                          Create a sub-menu item under {selectedMenu.name}.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="subName">Display Name</Label>
                          <Input
                            id="subName"
                            placeholder="e.g. About us, Facebook, Support Center"
                            value={subName}
                            onChange={(e) => setSubName(e.target.value)}
                          />
                        </div>

                        <div className="space-y-3">
                          <div className="space-y-1">
                            <Label className="text-xs">Link Type</Label>
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant={!newSubIsPage ? "default" : "outline"}
                                size="sm"
                                onClick={() => {
                                  setNewSubIsPage(false);
                                  setSubHref("");
                                }}
                                className="w-full text-xs rounded-xl"
                              >
                                Custom URL
                              </Button>
                              <Button
                                type="button"
                                variant={newSubIsPage ? "default" : "outline"}
                                size="sm"
                                onClick={() => {
                                  setNewSubIsPage(true);
                                  if (pages.length > 0) {
                                    setSubHref(`/${pages[0]?.slug || ""}`);
                                  }
                                }}
                                className="w-full text-xs rounded-xl"
                              >
                                Dynamic Page
                              </Button>
                            </div>
                          </div>

                          {newSubIsPage ? (
                            <div className="space-y-1.5">
                              <Label htmlFor="subPageSelect">Select Page</Label>
                              <Select
                                value={
                                  pages.find((p) => `/${p.slug}` === subHref)
                                    ?.slug || ""
                                }
                                onValueChange={(val) => setSubHref(`/${val}`)}
                              >
                                <SelectTrigger
                                  id="subPageSelect"
                                  className="rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200"
                                >
                                  <SelectValue placeholder="Choose a page..." />
                                </SelectTrigger>
                                <SelectContent>
                                  {pages.map((p) => (
                                    <SelectItem key={p.id} value={p.slug}>
                                      {p.title} (/{p.slug})
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          ) : (
                            <div className="space-y-1.5">
                              <Label htmlFor="subHref">URL / Path</Label>
                              <Input
                                id="subHref"
                                placeholder="e.g. /about, https://facebook.com"
                                value={subHref}
                                onChange={(e) => setSubHref(e.target.value)}
                              />
                            </div>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="subIcon">Icon Name (Optional)</Label>
                          <Input
                            id="subIcon"
                            placeholder="e.g. HelpCircle, FileCheck, ExternalLink"
                            value={subIcon}
                            onChange={(e) => setSubIcon(e.target.value)}
                          />
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          <Label htmlFor="subNewTab" className="cursor-pointer">
                            Open in New Tab?
                          </Label>
                          <Switch
                            id="subNewTab"
                            checked={subOpenNewTab}
                            onCheckedChange={setSubOpenNewTab}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setIsCreateSubOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleCreateSub}
                          disabled={!subName || !subHref || isPending}
                        >
                          {isPending ? "Adding..." : "Add Sub-item"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="space-y-2">
                  {selectedMenu.items.map((item, subIndex) => (
                    <div
                      key={item.id}
                      className="border border-slate-100 dark:border-slate-800/80 p-3 rounded-xl flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-2.5 h-2.5 bg-primary/30 rounded-full flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-sm text-foreground flex items-center gap-1.5">
                            {item.name}
                            {item.isOpenNewTab && (
                              <span className="text-[9px] text-primary bg-primary/10 border border-primary/20 px-1 py-0.2 rounded-md">
                                new tab
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground truncate max-w-[280px]">
                            {item.href}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <Badge
                          variant={item.isActive ? "default" : "secondary"}
                          className="mr-2 text-[10px] scale-90"
                        >
                          {item.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Switch
                          checked={item.isActive}
                          className="scale-75 mr-2"
                          onCheckedChange={(checked) =>
                            toggleSubState(item, checked)
                          }
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-7 h-7 text-muted-foreground hover:text-foreground"
                          disabled={subIndex === 0 || isPending}
                          onClick={() => {
                            const menuIdx = menus.findIndex(
                              (m) => m.id === selectedMenu.id,
                            );
                            moveSubUp(menuIdx, subIndex);
                          }}
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-7 h-7 text-muted-foreground hover:text-foreground"
                          disabled={
                            subIndex === selectedMenu.items.length - 1 ||
                            isPending
                          }
                          onClick={() => {
                            const menuIdx = menus.findIndex(
                              (m) => m.id === selectedMenu.id,
                            );
                            moveSubDown(menuIdx, subIndex);
                          }}
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-7 h-7 text-blue-600 hover:text-blue-700"
                          onClick={() => {
                            setEditingSub(item);
                            const isPage = item.href
                              ? pages.some((p) => `/${p.slug}` === item.href)
                              : false;
                            setEditSubIsPage(isPage);
                            setIsEditSubOpen(true);
                          }}
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-7 h-7 text-red-500 hover:text-red-600"
                          disabled={isPending}
                          onClick={() => handleDeleteSub(item.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {selectedMenu.items.length === 0 && (
                    <div className="border-2 border-dashed border-slate-100 dark:border-slate-800 p-8 text-center text-muted-foreground text-sm rounded-xl">
                      No links added to this group yet. Click Add Sub-Item to
                      start.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-primary/10 shadow-sm border-2 border-dashed h-[360px] flex flex-col justify-center items-center">
              <ChevronRight className="w-8 h-8 text-muted-foreground/30 animate-pulse" />
              <div className="font-semibold text-muted-foreground mt-2">
                Select a menu category
              </div>
              <div className="text-xs text-muted-foreground/80">
                Manage sub-items and settings dynamically
              </div>
            </Card>
          )}
        </div>
      </div>

      {editingMenu && (
        <Dialog open={isEditMenuOpen} onOpenChange={setIsEditMenuOpen}>
          <DialogContent className="rounded-2xl border-primary/10 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Menu Category: {editingMenu.name}</DialogTitle>
              <DialogDescription>
                Modify global settings for this header menu item.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-1.5">
                <Label htmlFor="editMenuName">Category Name</Label>
                <Input
                  id="editMenuName"
                  value={editingMenu.name}
                  onChange={(e) =>
                    setEditingMenu({ ...editingMenu, name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs">Link Type</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={!editMenuIsPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setEditMenuIsPage(false);
                        setEditingMenu({ ...editingMenu, href: "" });
                      }}
                      className="w-full text-xs rounded-xl"
                    >
                      Custom URL
                    </Button>
                    <Button
                      type="button"
                      variant={editMenuIsPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setEditMenuIsPage(true);
                        if (pages.length > 0) {
                          setEditingMenu({
                            ...editingMenu,
                            href: `/${pages[0]?.slug || ""}`,
                          });
                        }
                      }}
                      className="w-full text-xs rounded-xl"
                    >
                      Dynamic Page
                    </Button>
                  </div>
                </div>

                {editMenuIsPage ? (
                  <div className="space-y-1.5">
                    <Label htmlFor="editMenuPageSelect">Select Page</Label>
                    <Select
                      value={
                        pages.find(
                          (p) => `/${p.slug}` === (editingMenu.href || ""),
                        )?.slug || ""
                      }
                      onValueChange={(val) =>
                        setEditingMenu({ ...editingMenu, href: `/${val}` })
                      }
                    >
                      <SelectTrigger
                        id="editMenuPageSelect"
                        className="rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200"
                      >
                        <SelectValue placeholder="Choose a page..." />
                      </SelectTrigger>
                      <SelectContent>
                        {pages.map((p) => (
                          <SelectItem key={p.id} value={p.slug}>
                            {p.title} (/{p.slug})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <Label htmlFor="editMenuHref">
                      Direct URL / Path (Optional)
                    </Label>
                    <Input
                      id="editMenuHref"
                      placeholder="e.g. /contact (leave blank for dropdown)"
                      value={editingMenu.href || ""}
                      onChange={(e) =>
                        setEditingMenu({
                          ...editingMenu,
                          href: e.target.value || null,
                        })
                      }
                    />
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="editMenuIcon">Lucide Icon Name</Label>
                <Input
                  id="editMenuIcon"
                  placeholder="e.g. Cpu, BookOpen"
                  value={editingMenu.icon || ""}
                  onChange={(e) =>
                    setEditingMenu({
                      ...editingMenu,
                      icon: e.target.value || null,
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between pt-1">
                <Label
                  htmlFor="editMenuNewTab"
                  className="cursor-pointer text-xs"
                >
                  Open in New Tab?
                </Label>
                <Switch
                  id="editMenuNewTab"
                  checked={editingMenu.isOpenNewTab}
                  onCheckedChange={(checked) =>
                    setEditingMenu({ ...editingMenu, isOpenNewTab: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between pt-1">
                <Label
                  htmlFor="editMenuShowInHeader"
                  className="cursor-pointer text-xs"
                >
                  Show in Navbar Header?
                </Label>
                <Switch
                  id="editMenuShowInHeader"
                  checked={editingMenu.showInHeader}
                  onCheckedChange={(checked) =>
                    setEditingMenu({ ...editingMenu, showInHeader: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between pt-1">
                <Label
                  htmlFor="editMenuShowInFooter"
                  className="cursor-pointer text-xs"
                >
                  Show in Footer Link List?
                </Label>
                <Switch
                  id="editMenuShowInFooter"
                  checked={editingMenu.showInFooter}
                  onCheckedChange={(checked) =>
                    setEditingMenu({ ...editingMenu, showInFooter: checked })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditMenuOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateMenu}
                disabled={!editingMenu.name || isPending}
              >
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {editingSub && (
        <Dialog open={isEditSubOpen} onOpenChange={setIsEditSubOpen}>
          <DialogContent className="rounded-2xl border-primary/10 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Sub-Item: {editingSub.name}</DialogTitle>
              <DialogDescription>
                Modify settings for this sub-menu redirection link.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-1.5">
                <Label htmlFor="editSubName">Display Name</Label>
                <Input
                  id="editSubName"
                  value={editingSub.name}
                  onChange={(e) =>
                    setEditingSub({ ...editingSub, name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs">Link Type</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={!editSubIsPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setEditSubIsPage(false);
                        setEditingSub({ ...editingSub, href: "" });
                      }}
                      className="w-full text-xs rounded-xl"
                    >
                      Custom URL
                    </Button>
                    <Button
                      type="button"
                      variant={editSubIsPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setEditSubIsPage(true);
                        if (pages.length > 0) {
                          setEditingSub({
                            ...editingSub,
                            href: `/${pages[0]?.slug || ""}`,
                          });
                        }
                      }}
                      className="w-full text-xs rounded-xl"
                    >
                      Dynamic Page
                    </Button>
                  </div>
                </div>

                {editSubIsPage ? (
                  <div className="space-y-1.5">
                    <Label htmlFor="editSubPageSelect">Select Page</Label>
                    <Select
                      value={
                        pages.find((p) => `/${p.slug}` === editingSub.href)
                          ?.slug || ""
                      }
                      onValueChange={(val) =>
                        setEditingSub({ ...editingSub, href: `/${val}` })
                      }
                    >
                      <SelectTrigger
                        id="editSubPageSelect"
                        className="rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200"
                      >
                        <SelectValue placeholder="Choose a page..." />
                      </SelectTrigger>
                      <SelectContent>
                        {pages.map((p) => (
                          <SelectItem key={p.id} value={p.slug}>
                            {p.title} (/{p.slug})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <Label htmlFor="editSubHref">URL / Path</Label>
                    <Input
                      id="editSubHref"
                      value={editingSub.href}
                      onChange={(e) =>
                        setEditingSub({ ...editingSub, href: e.target.value })
                      }
                    />
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="editSubIcon">Icon Name (Optional)</Label>
                <Input
                  id="editSubIcon"
                  placeholder="e.g. Laptop, HelpCircle"
                  value={editingSub.icon || ""}
                  onChange={(e) =>
                    setEditingSub({
                      ...editingSub,
                      icon: e.target.value || null,
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between pt-2">
                <Label htmlFor="editSubNewTab" className="cursor-pointer">
                  Open in New Tab?
                </Label>
                <Switch
                  id="editSubNewTab"
                  checked={editingSub.isOpenNewTab}
                  onCheckedChange={(checked) =>
                    setEditingSub({ ...editingSub, isOpenNewTab: checked })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditSubOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleUpdateSub}
                disabled={!editingSub.name || !editingSub.href || isPending}
              >
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
