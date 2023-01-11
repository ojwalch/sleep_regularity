let EPOCHS_PER_DAY = 2880

function processRawData(rawData) {

    let splitByLines = rawData.split("\n");
    let dates = [];
    let times = [];
    let sleepWake = [];
    let epoch = [];

    let keyRow = 999999999;
    let zeroCounter = 0;
    let hasBeenNonzeroYet = 0;
    let cutoff_index = -1;
    let cuton_index = -1;
    console.log(splitByLines.length);

    for (let i = 1; i < splitByLines.length; i++) {
        let row = splitByLines[i].split(",");

        for( let j = 0; j < row.length; j++){
            row[j] = row[j].replace('\"', '');
            row[j] = row[j].replace('\"', '');
        }

        if (row.length == 8 && row[7] == "Interval Status"){
            keyRow = i + 2;
        }

        if (i > keyRow && cutoff_index == -1){
            if (row.length > 6){
                if (row[3] != "NaN" && row[0] != "NaN" && row[6] != "NaN"){
                    dates[i] = row[0];
                    times[i] = row[2];
                    sleepWake[i] = parseFloat(row[6]);
                    epoch[i] = parseFloat(row[0]);

                    if (Math.round(row[6]) == 0){
                        zeroCounter = zeroCounter + 1;
                        }
                    else{
                        zeroCounter = 0;
                        hasBeenNonzeroYet = 1;
                    }
                    if (zeroCounter > EPOCHS_PER_DAY && cutoff_index == -1){
                        if (hasBeenNonzeroYet == 1){
                            cutoff_index = epoch.length - EPOCHS_PER_DAY;
                        }
                        else{
                            cuton_index = epoch.length;
                        }
                    }
                }
            }
        }
    }

    //         if cutoff_index == -1:
    //         cutoff_index = (epoch.length)-1
    console.log(dates);
    console.log(sleepWake);
    return {dates, times, sleepWake, epoch}
}

function getSRI(sleepWake, epoch){
    let counter = 0;
    let total = 0;

    for (let i = 1; i < sleepWake.length; i++) {
        let current_epoch = epoch[i];
        let next_day = current_epoch + EPOCHS_PER_DAY;
        let current_sleep_wake = sleepWake[i];

        let next_index = epoch.indexOf(next_day);
        if (next_index != -1){
            let next_sleep_wake = sleepWake[next_index];
            total = total + 1.0;

            if (current_sleep_wake == next_sleep_wake){
                counter = counter + 1.0;
            }
        }
    }
    let sri = 100*counter/total;

    return {sri}
}

onmessage = function (e) {

    const {rawData, filename} = e.data;
    const {dates, times, sleepWake, epoch} = processRawData(rawData);

    const {sri} = getSRI(sleepWake, epoch);

    postMessage({filename, sri});
}
