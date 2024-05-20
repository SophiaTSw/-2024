// Basic information about the current version
$("#version").append(reportConfig.version);
$("#version-info>.time").append(`${repJson.testPeriod["startTime"]} - ${repJson.testPeriod["endTime"]}`);

// Bug  basic information
function getBugLevelRate() {
    const bugLevelCount = repJson.bugLevel.bugCount;
    const totalBugCount = repJson.totalBugCount;
    let bugLevelRate = {};
    let bugLevelRateText = "";

    for (let key in bugLevelCount) {
        bugLevelRate[key] = (bugLevelCount[key] / totalBugCount).toFixed(3);
    }

    for (let key in bugLevelRate) {
        if(bugLevelCount[key] != 0) bugLevelRateText += `缺陷等级为${key}的Bug共提交 ${bugLevelCount[key]} 个，占比为 ${(bugLevelRate[key]*100).toFixed(1)}% ；`;
    }
    return bugLevelRateText;
}

// Overview of the test situation
$("#bug-info [data-info='current']").append(`${reportConfig.version} 版本，App主要功能模块共提交有效Bug ${repJson.totalBugCount} 个；`);
$("#bug-info [data-info='current']").append(getBugLevelRate());
$("#bug-info [data-info='current']").append(`回归情况：平均回归次数为 ${repJson.regressionInfo.avgRegressionCount} 次，最大回归次数为 ${repJson.regressionInfo.maxRegressionCount} 次`);

if (repJson.compareWithPreviousVersion) {
    function getRateChangeText(value) {
        return value >= 0 ? `增加 ${(value*100).toFixed(1)}% ` : `减少 ${Math.abs((value*100).toFixed(1))}% `
    }

    let changeRate = repJson.compareWithPreviousVersion;
    for (let key in changeRate) {
        changeRate[key] = getRateChangeText(parseFloat(changeRate[key]));
    }

    let changeText = `与上一版本 - ${reportConfig.previousVersion} 相较，Bug数量${changeRate["bugCountChangeRate"]}，平均回归次数${changeRate["avgRegressionChangeRate"]}`;
    $("#bug-info [data-info='previous']").append(changeText);
}

// Regression information
$(".list").css("color", "red");

for (let maxRegressionBug of repJson.regressionInfo.maxRegressionCountBugInfo) {
    $("#regression > .list").append(`<p>${maxRegressionBug[reportConfig.sheetHeaderKey.bugDesc]}</p>`);
}

const regressionDescText = `以上bug为本周期回归次数最多的bug，回归次数为 ${repJson.regressionInfo.maxRegressionCount} 次，此类Bug较为影响回归进度`;
$("#regression > .desc").append(regressionDescText);

// Heigh level bug information
if (repJson.bugLevel.majorBugList.length > 0) {
    for (let heightLevelBug of repJson.bugLevel.majorBugList) {
        $("#high-level > .list").append(`<p>现象：${heightLevelBug[reportConfig.sheetHeaderKey.bugDesc]}</p>`);
        $("#high-level > .desc").append(`<p>造成原因：${heightLevelBug[reportConfig.sheetHeaderKey.bugReason]}</p>`);
        $("#high-level > .desc").append(`<p>解决方案：${heightLevelBug[reportConfig.sheetHeaderKey.bugSolution]}</p>`);
    }   
} else $("#high-level > .list").append(`<p>No Data</p>`);

// Low quality and missed test bug
const lowQualityBugList = repJson.testNoteInfo.lowQualityBug;
const missedTestBugList = repJson.testNoteInfo.missedBug;
$("#low-quality > .list").css("color", "blue");
if (lowQualityBugList.length > 0) {
    for (let lowQualityBug of lowQualityBugList) {
        $("#low-quality > .list").append(`<p>${lowQualityBug[reportConfig.sheetHeaderKey.bugDesc]}</p>`);
    }   
} else $("#low-quality > .list").append(`<p>No Data</p>`);

$("#missed-test > .list").css("color", "blue");
if (missedTestBugList.length > 0) {
    for (let missedTestBug of missedTestBugList) {
        $("#missed-test > .list").append(`<p>${missedTestBug[reportConfig.sheetHeaderKey.bugDesc]}</p>`);
    }   
} else $("#missed-test > .list").append(`<p>No Data</p>`);

// Version risk
const unresolvedBugList = repJson.versionRisk.unresolvedBug;
const unreproducibleBugList = repJson.versionRisk.unreproducibleBug;

$("#version-risk .list").css("color", "#6495ED");
if (unresolvedBugList.length > 0) {
    for (let unresolvedBug of unresolvedBugList) {
        $(".unresolved > .list").append(`<p>${unresolvedBug[reportConfig.sheetHeaderKey.bugDesc]}</p>`);
    }   
} else $(".unresolved > .list").append(`<p>No Data</p>`);

if (unreproducibleBugList.length > 0) {
    for (let unresolvedBug of unreproducibleBugList) {
        $(".unreproducible > .list").append(`<p>${unresolvedBug[reportConfig.sheetHeaderKey.bugDesc]}</p>`);
    }   
} else $(".unreproducible > .list").append(`<p>No Data</p>`);