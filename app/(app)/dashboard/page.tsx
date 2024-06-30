import { useToast } from "@/components/ui/use-toast"
import { Message } from "@/models/User"
import { AcceptMessageSchema } from "@/schemas/acceptMessageSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { useSession } from "next-auth/react"
import { useCallback, useState } from "react"
import { useForm } from "react-hook-form"

export const dashboard = () => {
    const [messages, setMessages] = useState<Message[]>([])
    const [isloading, setIsLoading] = useState(false)
    const [switchIsLoading, setSwitchIsLoading] = useState(false)

    const { toast } = useToast();

    const handleDeleteClick = (messageId: string) => {
        setMessages(messages.filter((message) => {
            message._id !== messageId
        }))
    }

    const { data: session } = useSession()
    const form = useForm({
        resolver: zodResolver(AcceptMessageSchema)
    })
    const { watch, setValue, register } = form
    const acceptMessages = watch('acceptMessages')

    const fetchAcceptMessages = useCallback(async () => {
        setSwitchIsLoading(true)
        try {
            const response = await axios.get<ApiResponse>('/api/accept-messages')
            setValue('acceptMessages', response.data.isAcceptingMessages)
        } catch (error) {
         const axiosError = error as AxiosError<ApiResponse>
         toast({
            title: "Error",
            description : axiosError.response?.data.message || "Failed to fetch messages",
            variant: "destructive"
         })
        } finally{
            setSwitchIsLoading(false)
        }
    }, [setValue])


    return (
        <div>

        </div>
    )
}