class ChangeDetectionService {
    getAlerts(oldMatches: Array<any>, newMatches: Array<any>) {
        const hashedObj: any = this.getHashMap(oldMatches);
        const hashedObjNew: any = this.getHashMap(newMatches);
        const alerts: Array<any> = [];
        newMatches.forEach((item) => {
            if (
                this.isLikelihoodForAlert(item.match)
            ) {
                if (hashedObj[item.entity_unique_id]) {
                    item["old_match"] = hashedObj[item.entity_unique_id].match;
                    item["alert_type"] = this.checkForMonitoringRules(
                        hashedObj[item.entity_unique_id],
                        item
                    );
                    if (item.alert_type.length) {
                        this.setCategoriesAndSubCategories(
                            hashedObj[item.entity_unique_id].comments,
                            item.comments,
                            item
                        );
                        alerts.push({ ...item, intermediate_entity_record: undefined });
                    }
                } else {
                    item["alert_type"] = "New Match";
                    item["old_match"] = "";
                    this.setCategoriesAndSubCategories("", item.comments, item);
                    alerts.push({ ...item, intermediate_entity_record: undefined });
                }
            }
        });

        /**
         * checking if an old match is removed from new matches
         * */
        oldMatches.forEach((item) => {
            if (
                this.isLikelihoodForAlert(item.match)
            ) {
                if (!hashedObjNew[item.entity_unique_id]) {
                    item["alert_type"] = "Match Disappeared";
                    item["old_match"] = "";
                    this.setCategoriesAndSubCategories(item.comments, "", item);
                    alerts.push(item);
                }
            }
        });
        return alerts;
    }

    /**
     * checks for two likelihood change and category/subcategofy change
     * */
    checkForMonitoringRules(oldMatch: any, newMatch: any) {
        let alertType = "";
        alertType = this.detectMatchCriteriaChange(oldMatch, newMatch);
        alertType = alertType.length
            ? alertType +
            ", " +
            this.detectCategorySubCategoryChange(oldMatch, newMatch)
            : this.detectCategorySubCategoryChange(oldMatch, newMatch);
        return alertType;
    }

    /**
     * Get hash map for matches
     */
    getHashMap(oldMatches: Array<any>) {
        let obj = {};
        oldMatches.forEach((item) => {
            obj = {...obj, [item["entity_unique_id"]]: item};
        });
        return obj;
    }

    detectMatchCriteriaChange(oldMatch: any, newMatch: any) {
        if (oldMatch.match === newMatch.match) {
            return "";
        } else {
            return "Likelihood Change";
        }
    }

    detectCategorySubCategoryChange(oldMatch: any, newMatch: any) {
        const {
            cats: oldCats,
            subCats: oldSubcats
        } = this.extractCategoriesAndSubCategories(oldMatch.comments);
        const {
            cats: newCats,
            subCats: newSubcats
        } = this.extractCategoriesAndSubCategories(newMatch.comments);

        const catStatus = this.compareArr(oldCats, newCats);
        const subCatStatus = this.compareArr(oldSubcats, newSubcats);
        const combineStatus = Array.from(new Set([catStatus, subCatStatus])).join();
        return combineStatus;
    }

    extractCategoriesAndSubCategories(comments: any) {
        comments = comments
            .split("||")
            .filter((item: any) => item.includes("Category"))
            .map((item: any) => {
                item = item.split("|");
                return {Category: item[0], Subcategory: item[1]};
            });
        let cats = comments.map((item: any) =>
            item["Category"].replace("Category:", "").trim()
        );
        let subCats = comments.map((item: any) =>
            item["Subcategory"].replace("Subcategory:", "").trim()
        );
        return {cats, subCats};
    }

    setCategoriesAndSubCategories(oldMatch: string, newMatch: string, match: any) {
        match["old_categories"] = oldMatch
            ? this.groupCategoriesAndSubCategories(oldMatch)
            : "";
        match["new_categories"] = newMatch
            ? this.groupCategoriesAndSubCategories(newMatch)
            : "";
    }

    groupCategoriesAndSubCategories(comments: any) {
        comments = comments
            .split("||")
            .filter((item: any) => item.includes("Category"))
            .map((item: any) => {
                item = item.split("|");
                item[0] = item[0].split(":");
                item[1] = item[1].split(":");
                return {category: item[0][1].trim(), subcategory: item[1][1].trim()};
            })
            .reduce((group: any, product: any) => {
                const {category} = product;
                group[category] = group[category] ?? [];
                group[category].push(product.subcategory);
                return group;
            }, {});

        return JSON.stringify(comments);
    }

    compareArr(oldArr: any, newArr: any) {
        oldArr = Array.from(new Set([oldArr]));
        newArr = Array.from(new Set([newArr]));
        const isPrevRemoved = oldArr.filter((x: any) => !newArr.includes(x));
        const isNewAdded = newArr.filter((x: any) => !oldArr.includes(x));

        if (isNewAdded.length && isPrevRemoved.length) {
            return "Category Change";
        } else if (isNewAdded.length) {
            return "New Category";
        } else if (isPrevRemoved.length) {
            return "Category Removed";
        } else {
            return "";
        }
    }

    isLikelihoodForAlert(matchLikelihood: string) {
        if (
            matchLikelihood === "Exact" ||
            matchLikelihood === "High" ||
            matchLikelihood === "Medium"
        ) {
            return true;
        }
        return false;
    }
}

const changeDetectionService = new ChangeDetectionService();
export default changeDetectionService;
