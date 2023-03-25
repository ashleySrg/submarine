import columnify from 'columnify';
import { getSubmarineListForDisplay } from "../commands/functions/getSubmarineListForDisplay";

export const checkTime = async () => {
	process.stdout.write('\u001B[3J\u001B[H\u001B[2J');
	process.stdout.write('\r' + new Date().toString() + '\n');
    const submarineList = await getSubmarineListForDisplay('All');
    process.stdout.write(columnify(submarineList, {
        columnSplitter: '|'
    }));
    process.stdout.write('\n\n');

    const nowTime = new Date();

    submarineList.forEach(submarine => {
        // if (submarine.departure_time !== '0') {
        //     const departureTime = new Date(submarine.departure_time);
        //     const requiredTime = submarine.required_time;
        //     const arrivalTime = new Date(departureTime.getTime() + Number.parseInt(requiredTime));

        //     if (arrivalTime <= nowTime) {
        //         console.log(`NOTICE: ${submarine.server}#${submarine.numbering}`);
        // }
        //     console.log(submarine.name);
        // }

    });
}
