import React from "react";
import { ResponsiveLine } from "@nivo/line";

interface SalesQtyChartProps {
  sellsQty: { y: number; x: string }[];
}

const SalesQtyChart: React.FC<SalesQtyChartProps> = ({sellsQty}) => {
    return (
        <div className={'h-[450px] w-full shadow-xl bg-white rounded-xl rounded-bl-2xl rounded-tr-2xl py-8'}>
            <h1 className={'text-center font-inter font-semibold mt-2'}>Sells Quantity Day By Day</h1>
                <ResponsiveLine

                    data={
                        [
                            {
                                id:'Sells Quantity',
                                data:sellsQty
                            }
                        ]
                    }
                    colors={{
                        scheme:'red_blue',
                        size:9
                    }}
                    curve={'monotoneY'}
                    
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
                        legend: 'Quantity',
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

export default SalesQtyChart