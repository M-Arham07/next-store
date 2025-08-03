"use client"
  //USAGE:

//   < ProgressModal isOpen = { modalOpen }
// status = { modalStatus }
// savingTitle="Saving Product"
// successDescription = "Product Saved Successfuly!"
// failedDescrption = "Failed Saving Product!"
// onClose={()=>setModalOpen(false)}
// percentage = { Progress }
//   />









import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export default function ProgressModal({ isOpen, status, percentage = 0, savingTitle, successDescription, failedDescrption, onClose }) {
  const getProgressColor = (progress) => {
    if (progress < 20) return "from-red-500 to-red-600"
    if (progress < 40) return "from-orange-500 to-orange-600"
    if (progress < 60) return "from-yellow-500 to-yellow-600"
    if (progress < 80) return "from-blue-500 to-blue-600"
    return "from-green-500 to-green-600"
  }

  const getStatusContent = () => {
    switch (status) {
      case "saving":
        return {
          icon: null,
          title: savingTitle,
          description: `${Math.round(percentage)}%`,
          showProgress: true,
          buttonText: null,
          buttonColor: null,
        }
      case "success":
        return {
          icon: <CheckCircle2 className="w-8 h-8 text-green-500" />,
          title: "Success",
          description: successDescription,
          showProgress: false,
          buttonText: "Done",
          buttonColor: "bg-green-600 hover:bg-green-700",
        }
      case "failed":
        return {
          icon: <AlertCircle className="w-8 h-8 text-red-500" />,
          title: "Failed",
          description: failedDescrption,
          showProgress: false,
          buttonText: "Close",
          buttonColor: "bg-red-600 hover:bg-red-700",
        }
      default:
        return {
          icon: null,
          title: "Saving Product",
          description: "0%",
          showProgress: true,
          buttonText: null,
          buttonColor: null,
        }
    }
  }

  const statusContent = getStatusContent()

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-black border border-gray-200 dark:border-white/10 shadow-xl" showCloseButton={false}>
        <DialogHeader className="relative">
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white text-center">{statusContent.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-6">
          {/* Status Content */}
          <div className="flex flex-col items-center space-y-4">
            {statusContent.icon && <div className="flex items-center justify-center">{statusContent.icon}</div>}

            <div className="text-center space-y-2">
              {status === "saving" && (
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{statusContent.description}</div>
              )}

              {status !== "saving" && <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{statusContent.description}</p>}
            </div>
          </div>

          {/* Linear Progress Bar - Only show when saving */}
          {statusContent.showProgress && (
            <div className="space-y-3">
              <div className="relative h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "absolute top-0 left-0 h-full bg-gradient-to-r transition-all duration-300 ease-out",
                    getProgressColor(percentage),
                  )}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              {/* Progress segments */}
              <div className="flex justify-between">
                {[0, 20, 40, 60, 80, 100].map((threshold, index) => (
                  <div
                    key={index}
                    className={cn(
                      "w-2 h-2 rounded-full border-2 border-white transition-all duration-300",
                      percentage >= threshold
                        ? percentage < 20
                          ? "bg-red-500"
                          : percentage < 40
                            ? "bg-orange-500"
                            : percentage < 60
                              ? "bg-yellow-500"
                              : percentage < 80
                                ? "bg-blue-500"
                                : "bg-green-500"
                        : "bg-gray-300",
                    )}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Action Button - Only show for success/failed states */}
          {statusContent.buttonText && (
            <div className="flex justify-center pt-4">
              <Button 
                onClick={onClose}
                className={cn("text-white px-6", statusContent.buttonColor)}
              >
                {status === "success" && <CheckCircle2 className="w-4 h-4 mr-2" />}
                {status === "failed" && <AlertCircle className="w-4 h-4 mr-2" />}
                {statusContent.buttonText}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
