import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  title: string;
  value: string | number;
  note: string;
};

export function MetricCard({ title, value, note }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="metric-value">{value}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="muted small" style={{ margin: 0 }}>{note}</p>
      </CardContent>
    </Card>
  );
}
