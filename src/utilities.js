const timeFormat = new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false, // User 24 hours
    // timeZoneName: 'short',
});
function formatTime(time) {
    return timeFormat.format(new Date(time /* * 1000 */));
}


function convertScore (score, unit) {
    if (score === undefined || score === null) return null;
    const unitMap = {
        'msec': (score) => {
            if (typeof score !== 'number' || score < 0) {
                console.warn('The score type with msec is negative value');
                return null;
            }
            const minutes = Math.floor(score / (1000 * 60));
            const remainingSeconds = score % (1000 * 60);
            const seconds = Math.floor(remainingSeconds / 1000);
            const milliseconds = remainingSeconds % 1000;
            
            // Format the output
            const formattedMinutes = minutes.toString().padStart(2, '0');
            const formattedSeconds = seconds.toString().padStart(2, '0');
            const formattedMilliseconds = milliseconds.toString().slice(0,2).padStart(2, '0');
            
            return `${formattedMinutes}:${formattedSeconds}:${formattedMilliseconds}`;
        },
        'sec': (score) => {
            if (typeof score !== 'number' || score < 0) {
                console.warn('The score type with sec is negative value');
                return null;
            }
            const minutes = Math.floor(score / 60);
            const seconds = score % 60;

            const formattedMinutes = minutes.toString().padStart(2, '0');
            const formattedSeconds = seconds.toString().padStart(2, '0');
            
            return `${formattedMinutes}:${formattedSeconds}`;
        },
        'default': (score) => score,
    };

    const chosenUnit = unit in unitMap ? unit : 'default';
    return unitMap[chosenUnit](score);
}


function copyText(target) {
    const copiedText = typeof target === "string"
    ? target : 'undefined';
    
    navigator.clipboard.writeText(copiedText);
    
    // emitter.emit("copyText", { message: copyText(copiedText) });
    return copiedText;
}


export { formatTime, convertScore, copyText };