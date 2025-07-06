import { useParams } from "next/navigation";
import { api } from "../../utils/api";
import FormPartial from "./partials/form";

export default function TicketSlugPage()
{
    const params = useParams();
    const slug: string = params?.slug?.toString() ?? '';
    const { data: ticket } = api.tickets.get.useQuery({ id: slug });
    
    return (
        <div>
            <h1>Edit ticket id: {ticket?.id}</h1>
            <FormPartial ticket={ticket}/>
        </div>
    )
}