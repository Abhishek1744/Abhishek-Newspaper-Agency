import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function PendingRequestsDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: requests, isLoading } = useQuery({
    queryKey: ["subscription-requests"],
    queryFn: async () => {
      console.log("Fetching pending requests...");
      const { data, error } = await supabase
        .from("subscription_requests")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching pending requests:", error);
        throw error;
      }
      
      console.log("Raw pending requests data:", data);
      return data || [];
    },
    refetchInterval: 5000, // Refetch every 5 seconds
    refetchOnWindowFocus: true,
    retry: 3,
  });

  const handleRequest = async (request: any, action: 'approve' | 'reject') => {
    try {
      if (action === 'approve') {
        console.log("Creating new customer from request:", request);
        // First, create the customer
        const { data: customer, error: customerError } = await supabase
          .from("customers")
          .insert([
            {
              name: request.name,
              email: request.email,
              phone: request.phone,
              address: request.address,
              status: "active",
            },
          ])
          .select()
          .single();

        if (customerError) {
          console.error("Error creating customer:", customerError);
          throw customerError;
        }
        
        console.log("Customer created successfully:", customer);
      }

      // Update the request status
      console.log(`Updating request status to ${action}:`, request.id);
      const { error: updateError } = await supabase
        .from("subscription_requests")
        .update({ status: action === 'approve' ? "approved" : "rejected" })
        .eq("id", request.id);

      if (updateError) {
        console.error("Error updating request status:", updateError);
        throw updateError;
      }

      toast({
        title: action === 'approve' ? "Request approved" : "Request rejected",
        description: action === 'approve' 
          ? "Customer has been successfully created."
          : "Request has been rejected.",
      });

      // Invalidate both queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["subscription-requests"] });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${action} request. Please try again.`,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <AlertCircle className="mr-2" />
          Pending Requests
          {requests?.length ? (
            <span className="ml-2 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">
              {requests.length}
            </span>
          ) : null}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Pending Customer Requests</DialogTitle>
          <DialogDescription>
            Review and manage customer subscription requests
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : !requests?.length ? (
          <p className="text-center text-muted-foreground py-4">
            No pending requests
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.name}</TableCell>
                  <TableCell>{request.email}</TableCell>
                  <TableCell>{request.phone}</TableCell>
                  <TableCell>{request.address}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleRequest(request, 'approve')}
                        className="gap-1"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRequest(request, 'reject')}
                        className="gap-1"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  );
}