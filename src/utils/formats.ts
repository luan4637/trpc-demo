export function fnFormatDateTime(date: string)
{
    return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'short',
        timeStyle: 'medium'
    }).format(new Date(date));
};