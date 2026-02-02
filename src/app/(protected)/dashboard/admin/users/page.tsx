import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Icon } from "@iconify/react";

const users = [
  {
    id: 1,
    name: "Olivia Martin",
    email: "olivia@example.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: 2,
    name: "Jackson Lee",
    email: "jackson@example.com",
    role: "Editor",
    status: "Active",
  },
  {
    id: 3,
    name: "Isabella Nguyen",
    email: "isabella@example.com",
    role: "Viewer",
    status: "Inactive",
  },
  {
    id: 4,
    name: "William Kim",
    email: "william@example.com",
    role: "Editor",
    status: "Active",
  },
  {
    id: 5,
    name: "Sofia Davis",
    email: "sofia@example.com",
    role: "Admin",
    status: "Active",
  },
];

export default function Users() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-slate-400 mt-1">
            Manage your team members and their permissions.
          </p>
        </div>
        <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
          <Icon icon="bi:plus" className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <Card className="border border-gray-200/10">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>All Users</CardTitle>
              <CardDescription>
                A list of all users in your organization.
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Icon
                icon="bi:search"
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              />
              <Input placeholder="Search users..." className="pl-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 px-4 text-left text-sm font-medium text-slate-400">
                    Name
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-slate-400">
                    Email
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-slate-400">
                    Role
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-slate-400">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                  >
                    <td className="py-3 px-4 text-sm font-medium">
                      {user.name}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-400">
                      {user.email}
                    </td>
                    <td className="py-3 px-4 text-sm">{user.role}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          user.status === "Active"
                            ? "bg-green-500/10 text-green-600"
                            : "bg-muted text-slate-400"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
