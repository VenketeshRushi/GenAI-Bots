import { Button } from "../ui/button";
import { MoreVertical, MoveRight } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
// import UpgradeButton from "../UpgradeButton";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxTransportHoot";
import { removeUser } from "@/features/authSlice";
import { ModeToggle } from "../ModeToggle";

const Navbar = () => {
	const { user } = useAppSelector((state) => state.auth);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const pathname = location.pathname;

	console.log("pathname navbar ***", pathname);
	const logout = () => {
		dispatch(removeUser());
		navigate("/login");
	};
	return (
		<div className="py-4 px-4 flex items-center justify-between border-b shadow-sm">
			<Link to="/" className="flex items-center gap-2 self-center font-medium">
				<div className="flex h-6 w-6 items-center justify-center rounded-md text-primary-foreground">
					<img src={"/streamify.png"} />
				</div>
				Acme Inc.
			</Link>

			<div className="flex items-center space-x-2">
				{user ? (
					<>
						<div className="hidden lg:flex items-center space-x-2">
							{pathname === "/" ? (
								<Button asChild variant={"secondary"} className="">
									<Link to="/dashboard">
										Dashboard <MoveRight className="ml-2 h-4 w-4" />
									</Link>
								</Button>
							) : (
								<div className="flex items-center space-x-2">
									<Button asChild variant={"secondary"} className="">
										<Link to="/chatbot">Chat With PDF</Link>
									</Button>
									<Button asChild variant={"secondary"} className="">
										<Link to="/imagebot">Image Generation</Link>
									</Button>
									{/* <Button asChild variant={"secondary"} className="">
										<Link to="/user/documents/videos">Videos</Link>
									</Button>
									<Button asChild variant={"secondary"} className="">
										<Link to="/user/documents/audios">Audios</Link>
									</Button> */}
									{/* <Button asChild variant={"secondary"} className="">
										<Link to="/dashboard/upgrade">Pricing</Link>
									</Button> */}
									{/* <Button asChild variant={"secondary"} className="">
										<Link to="/dashboard/upload">
											<FilePlus2 className="h-4 w-4" />
										</Link>
									</Button> */}
									{/* <Button asChild variant={"secondary"} className="">
										<UpgradeButton />
									</Button> */}
								</div>
							)}
							<Button onClick={logout}>Sign out</Button>
						</div>
						<div className="flex lg:hidden items-center gap-1">
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button size="icon" variant="outline" className="h-8 w-8">
										<MoreVertical className="h-3.5 w-3.5" />
										<span className="sr-only">More</span>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									{pathname === "/" ? (
										<DropdownMenuItem>
											<Button asChild variant={"ghost"} className="w-full">
												<Link to="/dashboard">
													Dashboard <MoveRight className="ml-2 h-4 w-4" />
												</Link>
											</Button>
										</DropdownMenuItem>
									) : (
										<>
											<DropdownMenuItem>
												<Button variant={"ghost"} className="w-full ">
													<Link to="/chatbot">Chat With PDF</Link>
												</Button>
											</DropdownMenuItem>
											<DropdownMenuItem>
												{" "}
												<Button variant={"ghost"} className="w-full ">
													<Link to="/imagebot">Image Generation</Link>
												</Button>
											</DropdownMenuItem>
											{/* <DropdownMenuItem>
												{" "}
												<Button variant={"ghost"} className="w-full ">
													<Link to="/user/documents/videos">Videos</Link>
												</Button>
											</DropdownMenuItem>
											<DropdownMenuItem>
												{" "}
												<Button variant={"ghost"} className="w-full ">
													<Link to="/user/documents/audios">Audios</Link>
												</Button>
											</DropdownMenuItem> */}

											{/* <DropdownMenuItem>
												<Button variant={"ghost"} className="w-full ">
													<Link to="/dashboard/upgrade">Pricing</Link>
												</Button>
											</DropdownMenuItem> */}
											{/* <DropdownMenuItem>
												<UpgradeButton />
											</DropdownMenuItem> */}
											<DropdownMenuSeparator />
										</>
									)}
									<DropdownMenuItem>
										<Button
											className="w-full"
											variant={"destructive"}
											onClick={logout}
										>
											Sign out
										</Button>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</>
				) : (
					<>
						{pathname === "/login" ? (
							<Button asChild>
								<Link to="/signup">Sign up</Link>
							</Button>
						) : (
							<Button asChild>
								<Link to="/login">Login</Link>
							</Button>
						)}
					</>
				)}
				<div className="">
					<ModeToggle />
				</div>
			</div>
		</div>
	);
};

export default Navbar;
