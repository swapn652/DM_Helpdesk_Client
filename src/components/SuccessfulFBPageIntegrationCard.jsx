import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { usePagesContext } from '../PagesContext';
import { useNavigate } from "react-router-dom";

export const SuccessfulFBPageIntegrationCard = ({ page }) => {
    const { deletePage } = usePagesContext();
    const navigate = useNavigate();

    const handleDelete = () => {
        deletePage(page.id)
    }

    const handleMessages = () => {
        navigate(`/messages?id=${page.id}`)
    }

  return (
    <Card sx={{ minWidth: 400, minHeight: 270, borderRadius: 2 }}>
        <CardContent className="flex flex-col items-center justify-center mt-6">
            <Typography variant="h5" component="h5">
                Facebook Page Integration
            </Typography>
            <Typography variant="h7" component="h7">
                Integrated Page: <strong>{page.name}</strong>
            </Typography>
        </CardContent>
        <CardActions className="flex flex-col space-y-6 items-center justify-center">
            <button className="w-[90%] py-2 bg-red-700 text-white rounded-lg" onClick={() => handleDelete()}>
                Delete Integration
            </button>
            <button className="w-[90%] py-2 bg-blue-900 text-white rounded-lg" onClick={() => handleMessages()}>
                Reply To Messages
            </button>
        </CardActions>
    </Card>
  )
}
