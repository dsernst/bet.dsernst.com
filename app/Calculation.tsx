import { useState } from 'react'

import { calcBet, type Label, round } from './calcBet'

const midpointTypes = {
  Linear:
    'Simple average of both beliefs — gives equal expected value to each side.',
  Relative:
    'Balances the perceived % advantage for each person, based on how confident they are.',
}

export const Calculation = ({
  odds1,
  odds2,
}: {
  odds1: string
  odds2: string
}) => {
  const [usingLinear, setUsingLinear] = useState(false)
  const bet = calcBet(+odds1, +odds2)

  // Message if no bet
  if (!bet)
    return (
      <div className="opacity-30 italic h-74 pt-8">
        Enter odds for calculation
      </div>
    )

  const { labels } = bet
  const calculations = usingLinear ? bet.linear : bet.relative

  return (
    <div>
      {/* Payout */}
      <div className="flex justify-between gap-2 text-center w-42 mt-2">
        <div className="flex flex-col items-center">
          {/* Amount[0] */}
          <div>${round(calculations.amounts[0], 2)}</div>
          {/* YES/NO Label */}
          <Label label={labels[0]} />
        </div>
        <div className="flex flex-col items-center">
          {/* Amount[1] */}
          <div>${round(calculations.amounts[1], 2)}</div>
          {/* YES/NO Label */}
          <Label label={labels[1]} />
        </div>
      </div>

      {/* Payout Calculations */}
      <h2 className="text-sm font-bold mb-4 text-gray-500 mt-12">
        Payout Calculations
      </h2>

      <div className="*:flex *:justify-between *:gap-4">
        <p className="items-end">
          {/* Midpoint Switcher */}
          <span
            className="flex flex-col cursor-pointer border border-transparent hover:bg-gray-800/50 hover:border-gray-700 active:bg-gray-800 active:border-gray-700 rounded-md px-1.5 pt-1 pb-0.5 relative -ml-px -left-1.5"
            onClick={() => setUsingLinear(!usingLinear)}
            title={midpointTypes[usingLinear ? 'Linear' : 'Relative']}
          >
            {/* Midpoint Label */}
            <span className="text-xs text-gray-500 cursor-pointer -mb-0.5">
              {usingLinear ? 'Linear' : 'Relative'}
            </span>
            {/* Midpoint */}
            <b>Midpoint:</b>
          </span>
          <span className="relative bottom-0.5">
            {round(calculations._midpoint * 100, 1)}%
          </span>
        </p>
        {/* Opposite */}
        <p className="text-xs text-gray-500">
          <b>Opposite:</b> {round(calculations.opposite * 100, 1)}%
        </p>

        {/* Split */}
        <p className="mt-6 text-xs text-gray-500">
          <b>Split:</b> {round(calculations._midpoint * 100, 1)} :{' '}
          {round(calculations.opposite * 100, 1)}
        </p>

        {/* Normalized */}
        <p>
          <b>Normalized:</b>{' '}
          <span>
            {calculations._midpoint < 0.5 && <>1 : </>}
            <span
              className="cursor-help"
              title={`${round(calculations.normalized, 6)}`}
            >
              {round(calculations.normalized, 2)}
            </span>
            {calculations._midpoint >= 0.5 && <> : 1</>}
          </span>
        </p>

        {/* Expected Value */}
        <div className="text-xs mt-6 text-gray-500 flex flex-col !gap-1 w-full *:flex *:gap-1 *:justify-between *:items-center">
          <div className="self-center font-bold text-[10px]">
            Expected Value
          </div>
          <div className={usingLinear ? 'text-white/90' : ''}>
            <span className="w-12">
              <TinyPlus />
              {round(calculations.discounts.left.absolute * 100, 1)}¢
            </span>
            <span className="text-gray-500 text-[10px]">Absolute</span>
            <span className="w-12 text-right">
              <TinyPlus />
              {round(calculations.discounts.right.absolute * 100, 1)}¢
            </span>
          </div>
          <div className={usingLinear ? '' : 'text-white/90'}>
            <span className="w-12">
              <TinyPlus />
              {round(calculations.discounts.left.relative * 100, 1)}%
            </span>
            <span className="text-gray-500 text-[10px]">Relative</span>
            <span className="w-12 text-right">
              <TinyPlus />
              {round(calculations.discounts.right.relative * 100, 1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// <TinyPlus />
const TinyPlus = () => <span className="text-[10px] relative bottom-px">+</span>

// Parameterize YES/NO labels
const colors = { NO: 'text-red-500/60', YES: 'text-green-500/50' }
const Label = ({ label }: { label: Label }) => (
  <div className={`text-sm ${colors[label]}`}>{label}</div>
)
