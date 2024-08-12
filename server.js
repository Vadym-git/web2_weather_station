import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { engine } from "express-handlebars";
import { router } from "./routes.js";
import dayjs from "dayjs";

const app = express();
// Register a helper for uppercasing text
app.engine(".hbs", engine({
    extname: ".hbs",
    helpers: {
        uppercase: function (text) {
            return text.toUpperCase();
        },
        capitalizeFirst: function (text) {
            if (typeof text !== "string") return "";
            return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
        },
        toFixed: function (number, decimals) {
            if (typeof number !== "number") return "";
            return number.toFixed(decimals);
        },
        formatDate: function (date, format) {
            return dayjs(date).format(format);
        }
    }
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(fileUpload());
app.set("view engine", ".hbs");
app.set("views", "./views");
app.use("/", router);

const listener = app.listen(process.env.PORT || 4000, function () {
    console.log(`App started on http://localhost:${listener.address().port}`);
    });
