import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import "./Navbar.scss"

export const Navbar = () => {
  const navigate = useNavigate();

  return (
    
    <div className="nav1">
          <span onClick={() => navigate(-1)}> <ArrowBackIcon /></span>
          <img src={logo} alt="" />
        </div>
  )
}
