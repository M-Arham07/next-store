"use client"

import {  useState, useRef } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Eye, Trash2, UserMinus, Sparkles, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DeleteUser from "@/backend-utilities/delete-user/DeleteUser";
import useNotification from "@/hooks/useNotification";
import AlertNotification from "@/components/AlertNotification"
import RevokeAdmin from "@/backend-utilities/revoke-admin/revoke-admin"



let SUPERUSER_EMAIL = process.env.SUPERUSER_EMAIL;





// Format users to match required structure
const formatUser = (user) => {
  // Safe date parsing function
  const parseDate = (dateString) => {
    try {
      if (!dateString) return new Date();
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? new Date() : date;
    } catch (error) {
      console.error("Date parsing error:", error);
      return new Date();
    }
  };

  // Debug log


  return {
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.image || "/placeholder.svg",
    joinedAt: parseDate(user.createdAt),
    lastActive: parseDate(user.updatedAt),
    isAdmin: user?.isAdmin || false,
    isSuperuser: user?.isSuperuser || false
  };
};

export default function ManageUsersPage({ ALL_USERS = [], SU = false }) {

  const { showNotification, notify } = useNotification(3000);


  // Format and separate users and admins based on isAdmin property
  const initialSeparatedUsers = ALL_USERS.reduce(
    (acc, user) => {
      const formattedUser = formatUser(user);
      if (user?.isAdmin) {
        acc.admins.push(formattedUser);
      } else {
        acc.users.push(formattedUser);
      }
      return acc;
    },
    { users: [], admins: [] }
  );

  const [users, setUsers] = useState(initialSeparatedUsers.users)
  const [admins, setAdmins] = useState(initialSeparatedUsers.admins)
  const [selectedUser, setSelectedUser] = useState(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isRevokeDialogOpen, setIsRevokeDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const [adminToRevoke, setAdminToRevoke] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState("name")
  const [sortOrder, setSortOrder] = useState("asc")
  const [userTypeFilter, setUserTypeFilter] = useState("all")

  // Calculate total users (users + admins)
  const totalUsers = users.length + admins.length

  // Filter and sort users and admins based on search query and sort options
  const sortUsers = (userList) => {
    return [...userList].sort((a, b) => {
      let aValue, bValue

      switch (sortField) {
        case "joinedAt":
          aValue = new Date(a.joinedAt)
          bValue = new Date(b.joinedAt)
          break
        case "lastActive":
          aValue = new Date(a.lastActive)
          bValue = new Date(b.lastActive)
          break
        case "name":
        default:
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })
  }

  const filteredUsers = sortUsers(
    users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user?.email?.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  )

  const filteredAdmins = sortUsers(
    admins.filter(
      (admin) =>
        admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  )

  // Determine which accordions to show based on user type filter
  const showAdmins = userTypeFilter === "all" || userTypeFilter === "admins"
  const showUsers = userTypeFilter === "all" || userTypeFilter === "users"

  const formatDateTime = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    }).format(date)
  }

  const handleViewUser = (user, isAdmin = false) => {
    setSelectedUser({ ...user, isAdmin })
    setIsViewModalOpen(true)
  }

  const handleDeleteUser = (user) => {
    setUserToDelete(user)
    setIsDeleteDialogOpen(true)
  }


  const [alertMessage,setAlertMessage] = useState("");

  const confirmDeleteUser = async () => {
    // DELETE USER LOGIC, we're using id cuz its mapped to _id in this page!

    await DeleteUser(userToDelete.id);

    setAlertMessage(`${userToDelete.name} was deleted successfully `)
    notify();
    setUsers(users.filter((user) => user.id !== userToDelete.id));
    setIsDeleteDialogOpen(false);
    setUserToDelete(null);
  }

  const handleRevokeAdmin = (admin) => {
    setAdminToRevoke(admin)
    setIsRevokeDialogOpen(true)
  }

 

  
  const confirmRevokeAdmin = async () => {
    // REMOVE ADMIN LOGIC:
    //  We're using id cuz its mapped to _id in this page!
    await RevokeAdmin(adminToRevoke.id);
    setAlertMessage(`Revoked Admin Rights for ${adminToRevoke.name}`)
    notify();
    setAdmins(admins.filter((admin) => admin.id !== adminToRevoke.id))
    setIsRevokeDialogOpen(false)
    setAdminToRevoke(null)
  }

  const UserCard = ({ user, isAdmin = false, onView, onDelete, onRevoke }) => (



    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <Avatar className="h-12 w-12 flex-shrink-0">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm sm:text-base truncate">{user.name}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground truncate max-w-[17ch] sm:max-w-none">{user.email}</p>
            </div>
          </div>
          <div className="flex space-x-2 flex-shrink-0">
            <Button variant="outline" size="sm" onClick={() => onView(user, isAdmin)} className="h-8 w-8 p-0">
              <Eye className="h-4 w-4" />
            </Button>

            {/* ONLY SHOW THE DELETE BUTTON FOR THE CARDS IN ADMIN ACCORDION, IF logged in user is a superuser 
            AND IF user on the card is not a superuser */}

            {/* isAdmin indicates if the UserCard is in the ADMIN ACCORDION!
            HINT: Read isAdmin as isAdminAccordion !
             */}  


            {isAdmin ? SU && !user?.isSuperuser && (
              <Button variant="destructive" size="sm" onClick={() => onRevoke(user)} className="h-8 w-8 p-0">
                <UserMinus className="h-4 w-4" />
              </Button>
            ) : (
              <Button variant="destructive" size="sm" onClick={() => onDelete(user)} className="h-8 w-8 p-0">
                <Trash2 className="h-4 w-4" />
              </Button>
            )}

          </div>
        </div>
      </CardContent>
    </Card>
  )








  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Manage Users</h1>
        <p className="text-muted-foreground mb-4">Manage your platform users and administrators</p>

        {/* Total Users, Search, and Filters */}
        <div className="space-y-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Total Users:</span>
            <Badge variant="outline" className="text-sm">
              {totalUsers}
            </Badge>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 sm:max-w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search users and admins..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={userTypeFilter} onValueChange={setUserTypeFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Filter by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="users">Users Only</SelectItem>
                  <SelectItem value="admins">Admins Only</SelectItem>
                </SelectContent>
              </Select>

              {userTypeFilter === "all" && (
                <>
                  <Select value={sortField} onValueChange={setSortField}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="joinedAt">Joined Date</SelectItem>
                      <SelectItem value="lastActive">Last Active</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sortOrder} onValueChange={setSortOrder}>
                    <SelectTrigger className="w-full sm:w-32">
                      <SelectValue placeholder="Order" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asc">Ascending</SelectItem>
                      <SelectItem value="desc">Descending</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <Accordion type="multiple" className="w-full space-y-4">
        {showAdmins && (
          <AccordionItem
            value="admins"
            className="border rounded-lg shadow-md dark:shadow-lg dark:shadow-black/20 dark:border-gray-700 dark:border-b"
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center justify-between w-full mr-4">
                <span className="text-lg font-semibold">Admins</span>
                <Badge
                  variant="secondary"
                  className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                >
                  {filteredAdmins.length}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-3">
                {filteredAdmins.length > 0 ? (
                  filteredAdmins.map((admin, index) => (
                    <UserCard
                      key={admin.id || index}
                      user={admin}
                      isAdmin={true}
                      onView={handleViewUser}
                      onRevoke={handleRevokeAdmin}

                    />
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    {searchQuery ? "No admins found matching your search." : "No admins found."}
                  </p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {showUsers && (
          <AccordionItem
            value="users"
            className="border rounded-lg shadow-md dark:shadow-lg dark:shadow-black/20 dark:border-gray-700 dark:border-b"
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center justify-between w-full mr-4">
                <span className="text-lg font-semibold">Users</span>
                <Badge variant="secondary">{filteredUsers.length}</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">

              <div className="space-y-3">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => (
                    <UserCard key={user.id || index} user={user} onView={handleViewUser} onDelete={handleDeleteUser} />
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    {searchQuery ? "No users found matching your search." : "No users found."}
                  </p>
                )}

              </div>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>

      {/* View User Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              User Details
              {selectedUser?.isAdmin && (


                selectedUser.isSuperuser ? (
                  <Badge className="bg-gradient-to-r from-red-400 to-red-600 text-black animate-pulse">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Superuser
                  </Badge>
                ) : <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black animate-pulse">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Admin
                </Badge>
              )}

            </DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                  <AvatarFallback className="text-lg">
                    {selectedUser.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
                  <p className="text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Joined At</label>
                  <p className="text-sm">{formatDateTime(selectedUser.joinedAt)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Last Active</label>
                  <p className="text-sm">{formatDateTime(selectedUser.lastActive)}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {userToDelete?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteUser}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Revoke Admin Confirmation */}
      <AlertDialog open={isRevokeDialogOpen} onOpenChange={setIsRevokeDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke Admin Access</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to revoke admin access for {adminToRevoke?.name}? They will lose all administrative
              privileges.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRevokeAdmin}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Revoke
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {showNotification && <AlertNotification message={alertMessage} />}
    </div>
  )
}
