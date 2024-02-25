import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';


export const FBPageIntegrationCard = ({ handleLogin }) => {
    return (
        <Card sx={{ minWidth: 400, minHeight: 180, borderRadius: 2 }}>
            <CardContent className="flex items-center justify-center mt-6">
                <Typography variant="h5" component="h5">
                    Facebook Page Integration
                </Typography>
            </CardContent>
            <CardActions className="flex items-center justify-center">
                <button className="w-[90%] py-2 bg-blue-900 text-white rounded-lg" onClick={handleLogin}>
                    Connect Page
                </button>
            </CardActions>
        </Card>
    );
};
