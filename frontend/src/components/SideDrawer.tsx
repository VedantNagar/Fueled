import { styled, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import List from "@mui/material/List";
import EventForm from "./EventForm";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { CiLogout } from "react-icons/ci";
import axios from "axios";
import { Avatar } from "flowbite-react";
import { userprofile } from "../constants/constants";
import { useState, useEffect } from "react";
import Subevents from "./SubeventPanel";
import { logoutUser } from "../store/userSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import toast from "react-hot-toast";
import { IoIosAddCircleOutline } from "react-icons/io";
const drawerWidth = 220;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
    }),
}));

const SideDrawer = () => {
    const [eventFormSubmitted, setEventFormSubmitted] = useState(false);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const [isEventFormOpen, setEventFormIsOpen] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const handleDrawer = () => {
        setOpen(!open);
    };
    const handleLogout = () => {
        dispatch(logoutUser(navigate));
    };
    const [events, setEvents] = useState([]);
    useEffect(() => {
        toast.loading("Fetching events...", { id: "fetchingEvents" });
        const fetchEvents = async () => {
            try {
                const response = await axios.get(`${userprofile}/user/event`, {
                    withCredentials: true,
                });
                setEvents(response.data);
                toast.success("Events fetched successfully", {
                    id: "fetchingEvents",
                });
            } catch (error) {
                console.error("Error fetching events", error);
            }
        };
        fetchEvents();
    }, [eventFormSubmitted]);

    return (
        <Box sx={{ display: "flex" }}>
            <AppBar position="fixed" open={open}></AppBar>
            <div className="flex">
                <Drawer
                    variant="permanent"
                    open={open}
                    className="z-10 "
                    PaperProps={{
                        sx: {
                            backgroundColor: "#565B5E",
                            color: "#BFC1C0",
                        },
                    }}
                >
                    <DrawerHeader>
                        {open && (
                            <h1 className="text-2xl font-inter text-white ">
                                GetTogether
                            </h1>
                        )}
                        <IconButton
                            onClick={handleDrawer}
                            className="text-violet-200"
                        >
                            {open ? (
                                <ChevronLeftIcon className="text-violet-200" />
                            ) : (
                                <ChevronRightIcon className="text-violet-200" />
                            )}
                        </IconButton>
                    </DrawerHeader>
                    <Divider />
                    <List>
                        {["Add event"].map((text, _) => (
                            <ListItem
                                key={text}
                                disablePadding
                                sx={{ display: "block" }}
                            >
                                <ListItemButton
                                    sx={{
                                        minHeight: 38,
                                        justifyContent: open
                                            ? "initial"
                                            : "center",
                                        px: 2.5,
                                    }}
                                    onClick={() => setEventFormIsOpen(true)}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 1 : "auto",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <IoIosAddCircleOutline className="text-2xl text-violet-300" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={text}
                                        sx={{ opacity: open ? 1 : 0 }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                    <Divider />
                    <List>
                        {open && (
                            <h1 className="text-2xl px-5 py-2 font-inter">
                                Events
                            </h1>
                        )}
                        {events?.map((event: any) => (
                            <ListItem
                                key={event.id}
                                disablePadding
                                sx={{ display: "block" }}
                            >
                                <ListItemButton
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: open
                                            ? "initial"
                                            : "center",
                                        px: 2.5,
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 1 : "auto",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Avatar />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={event?.name}
                                        sx={{ opacity: open ? 1 : 0 }}
                                        className="text-violet-200"
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                    <Divider />
                    <List>
                        {["Logout"].map((text, _) => (
                            <ListItem
                                key={text}
                                disablePadding
                                sx={{ display: "block" }}
                            >
                                <ListItemButton
                                    onClick={handleLogout}
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: open
                                            ? "initial"
                                            : "center",
                                        px: 2.5,
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 1 : "auto",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <CiLogout className="text-2xl text-violet-200 font-extrabold" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={text}
                                        sx={{ opacity: open ? 1 : 0 }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Drawer>
                <Subevents subevents={[]} />
            </div>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                <Typography paragraph>
                    <EventForm
                        setFunction={setEventFormIsOpen}
                        parameter={isEventFormOpen}
                        setEventFormSubmitted={setEventFormSubmitted}
                    />
                </Typography>
            </Box>
        </Box>
    );
};

export default SideDrawer;
