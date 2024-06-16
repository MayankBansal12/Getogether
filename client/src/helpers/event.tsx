import { Chip } from "@mui/material";

const renderRole = (role: string) => {
    switch (role) {
        case 'host':
            return (
                <Chip variant="outlined" color="info" label="host" size="small" />
            )
        case 'vendor':
            return (
                <Chip variant="outlined" color="error" label="vendor" size="small" />
            )
        default:
            return (
                <Chip variant="outlined" color="success" label="guest" size="small" />
            )
    }
}

export { renderRole }