const COLORS = {
    want_to_read: 'bg-slate-100 text-slate-700',
    reading: 'bg-blue-100 text-blue-700',
    finished: 'bg-green-100 text-green-700',
    abandoned: 'bg-red-100 text-red-700',
};

export default function StatusBadge({ status }) {
    return (
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${COLORS[status] || 'bg-slate-100 text-slate-700'}`}>
            {status.replace('_', ' ')}
        </span>
    );
}