import React from "react";
import { ResponsiveLine } from "@nivo/line";

interface SalesAmountChartProps {
  data: { y: number; x: string }[];
}

const SalesAmountChart: React.FC<SalesAmountChartProps> = ({data}) => {
    return (
        <div className={'h-[450px] w-full  bg-white shadow-xl rounded-xl rounded-bl-2xl rounded-tr-2xl py-8'}>
            <h1 className={'text-center font-inter font-semibold mt-2'}>Sells Amount Day By Day</h1>
            <ResponsiveLine
                data={
                    [
                        {
                            id:'Sells Amount',
                            data:data
                        }
                    ]
                }
                enableGridX={true}
                curve='monotoneY'
                colors={{
                    scheme:'accent',
                    size:7
                }}
                margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                xScale={{ type: 'point' }}
                yScale={{
                    type: 'linear',
                    min: 'auto',
                    max: 'auto',
                    stacked: true,
                    reverse: false
                }}
                yFormat=" >-.2f"
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Date',
                    legendOffset: 36,
                    legendPosition: 'middle'
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Amount',
                    legendOffset: -40,
                    legendPosition: 'middle'
                }}
                pointSize={10}
                pointColor={{ theme: 'background' }}
                pointBorderWidth={2}
                pointBorderColor={{ from: 'serieColor' }}
                pointLabelYOffset={-12}
                useMesh={true}
                legends={[
                    {
                        anchor: 'bottom-right',
                        direction: 'column',
                        justify: false,
                        translateX: 100,
                        translateY: 0,
                        itemsSpacing: 0,
                        itemDirection: 'left-to-right',
                        itemWidth: 80,
                        itemHeight: 20,
                        itemOpacity: 0.75,
                        symbolSize: 12,
                        symbolShape: 'circle',
                        symbolBorderColor: 'rgba(0, 0, 0, .5)',
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemBackground: 'rgba(0, 0, 0, .03)',
                                    itemOpacity: 1
                                }
                            }
                        ]
                    }
                ]}
            />

        </div>
    )
}

export default SalesAmountChart