import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import sponsors from "data/sponsors";

export const load: PageLoad = (event) => {
    let sponsor = event.params.sponsor;

    let res = sponsors.filter((s) => s.name.toLowerCase().replace(" ", "-") == sponsor);

    if (res.length == 0) {
        error(404, "Not Found");
    } else if (res.length > 2) {
        // If this happens then we have duplicate sponsors...
        error(500, "Internal Error");
    }

    return res[0];
};
