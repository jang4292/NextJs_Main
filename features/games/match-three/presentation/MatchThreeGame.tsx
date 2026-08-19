"use client";

import { RotateCcw } from "lucide-react";
import { useEffect, useMemo, type CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Position } from "../domain/entities/Position";
import type { Tile } from "../domain/entities/Tile";
import { positionKey } from "../domain/rules/positionRules";
import {
  createTileViews,
  type GeneratedTileOffset,
} from "./animation/animationState";
import type { DragPreview, ScorePop } from "./hooks/useMatchThreeGame";
import { useMatchThreeGame } from "./hooks/useMatchThreeGame";
import { useTilePointerInput } from "./interaction/useTilePointerInput";
import styles from "./styles/matchThree.module.css";

const TILE_LABELS = {
  ruby: "Ruby",
  sapphire: "Sapphire",
  emerald: "Emerald",
  topaz: "Topaz",
  amethyst: "Amethyst",
  orange: "Orange",
} as const;

type CSSVars = CSSProperties & Record<`--${string}`, string | number>;

export function MatchThreeGame() {
  const game = useMatchThreeGame();
  const tileViews = useMemo(() => createTileViews(game.board), [game.board]);
  const renderedTileIds = useMemo(
    () => tileViews.map(({ tile }) => tile.id),
    [tileViews],
  );
  const pointerHandlers = useTilePointerInput({
    disabled: game.isInputLocked,
    onTap: game.tapTile,
    onSwipe: game.swipeTile,
    onDragStart: game.startDrag,
    onDragMove: game.moveDrag,
    onDragEnd: game.endDrag,
  });
  const isFinished = game.phase === "completed" || game.phase === "failed";
  const progress = Math.min(100, (game.score / game.targetScore) * 100);
  const cellCount = game.rows * game.columns;

  useEffect(() => {
    if (
      process.env.NODE_ENV === "production" ||
      game.clearedPositions.length === 0
    ) {
      return;
    }

    console.debug("[match-three] render cleared cells", {
      phase: game.phase,
      clearedPositions: game.clearedPositions,
      clearedPositionKeys: game.clearedPositions.map(positionKey),
      renderedTileCount: renderedTileIds.length,
      renderedTileIds,
    });
  }, [game.clearedPositions, game.phase, renderedTileIds]);

  return (
    <section className="mx-auto flex w-full flex-col items-center px-3 py-6">
      <div className="w-full max-w-3xl">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-neutral-950">3-Match</h2>
            <p className="mt-1 text-sm text-neutral-500">
              인접한 보석을 맞바꿔 목표 점수를 달성하세요.
            </p>
          </div>
          <Button type="button" variant="outline" onClick={game.restart}>
            <RotateCcw aria-hidden="true" />
            다시 시작
          </Button>
        </div>

        <div className="mb-4 grid grid-cols-3 gap-2">
          <Stat label="Score" value={game.score.toLocaleString()} />
          <Stat label="Target" value={game.targetScore.toLocaleString()} />
          <Stat label="Moves" value={game.movesRemaining.toString()} />
        </div>

        <div className={styles.progressTrack} aria-hidden="true">
          <div
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="relative mt-4 flex justify-center">
          <div
            className={styles.board}
            style={createBoardStyle(game.rows, game.columns)}
            aria-label="3-Match game board"
          >
            <div className={styles.cellLayer} aria-hidden="true">
              {Array.from({ length: cellCount }, (_, index) => (
                <div key={index} className={styles.boardCell} />
              ))}
            </div>

            {game.clearedPositions.length > 0 && (
              <div className={styles.clearLayer} aria-hidden="true">
                {game.clearedPositions.map((position) => (
                  <div
                    key={positionKey(position)}
                    className={styles.clearedCell}
                    style={createPositionStyle(
                      position,
                      game.rows,
                      game.columns,
                    )}
                  />
                ))}
              </div>
            )}

            <div className={styles.tileLayer}>
              {tileViews.map(({ tile, position }) => (
                <TileButton
                  key={tile.id}
                  position={position}
                  tile={tile}
                  rows={game.rows}
                  columns={game.columns}
                  dragPreview={game.dragPreview}
                  generatedOffset={game.generatedTileOffsets[tile.id] ?? null}
                  isSelected={game.selectedKey === positionKey(position)}
                  isSwapping={game.swappingTileIdSet.has(tile.id)}
                  isRemoving={game.removingTileIdSet.has(tile.id)}
                  isFalling={game.fallingTileIdSet.has(tile.id)}
                  isGenerated={game.generatedTileIdSet.has(tile.id)}
                  isInvalid={game.invalidTileIdSet.has(tile.id)}
                  disabled={game.isInputLocked || isFinished}
                  pointerHandlers={pointerHandlers}
                />
              ))}
            </div>

            {game.scorePops.map((scorePop) => (
              <ScorePopView
                key={scorePop.id}
                scorePop={scorePop}
                rows={game.rows}
                columns={game.columns}
              />
            ))}

            {isFinished && (
              <ResultDialog
                didWin={game.phase === "completed"}
                score={game.score}
                onRestart={game.restart}
              />
            )}
          </div>
        </div>

        <p className="mt-4 text-center text-sm leading-relaxed text-neutral-500">
          보석을 탭해 선택하거나, 한 칸 방향으로 드래그/스와이프하세요.
        </p>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-neutral-200 bg-white px-3 py-2 text-center shadow-sm">
      <div className="text-[11px] font-semibold tracking-wide text-neutral-500 uppercase">
        {label}
      </div>
      <div className="mt-1 text-lg font-bold text-neutral-950">{value}</div>
    </div>
  );
}

function TileButton({
  position,
  tile,
  rows,
  columns,
  dragPreview,
  generatedOffset,
  isSelected,
  isSwapping,
  isRemoving,
  isFalling,
  isGenerated,
  isInvalid,
  disabled,
  pointerHandlers,
}: {
  position: Position;
  tile: Tile;
  rows: number;
  columns: number;
  dragPreview: DragPreview | null;
  generatedOffset: GeneratedTileOffset | null;
  isSelected: boolean;
  isSwapping: boolean;
  isRemoving: boolean;
  isFalling: boolean;
  isGenerated: boolean;
  isInvalid: boolean;
  disabled: boolean;
  pointerHandlers: ReturnType<typeof useTilePointerInput>;
}) {
  const isDragging = dragPreview?.tileId === tile.id;

  return (
    <div
      className={cn(
        styles.tilePosition,
        isSwapping && styles.swapping,
        isFalling && styles.falling,
        isDragging && styles.dragging,
      )}
      style={createTileStyle(
        position,
        rows,
        columns,
        dragPreview,
        generatedOffset,
        tile.id,
      )}
    >
      <button
        type="button"
        className={cn(
          styles.tileButton,
          styles.filledTile,
          isSelected && styles.selected,
          isRemoving && styles.removing,
          isGenerated && styles.generated,
          isInvalid && styles.invalid,
        )}
        data-tile-type={tile.type}
        aria-label={`${TILE_LABELS[tile.type]} at row ${
          position.row + 1
        }, column ${position.column + 1}`}
        disabled={disabled}
        onPointerDown={(event) =>
          pointerHandlers.onPointerDown(event, position)
        }
        onPointerMove={pointerHandlers.onPointerMove}
        onPointerUp={pointerHandlers.onPointerUp}
        onPointerCancel={pointerHandlers.onPointerCancel}
      >
        <span className={styles.gem} aria-hidden="true" />
      </button>
    </div>
  );
}

function ScorePopView({
  scorePop,
  rows,
  columns,
}: {
  scorePop: ScorePop;
  rows: number;
  columns: number;
}) {
  return (
    <div
      className={styles.scorePop}
      style={createScorePopStyle(scorePop, rows, columns)}
    >
      +{scorePop.value}
    </div>
  );
}

function ResultDialog({
  didWin,
  score,
  onRestart,
}: {
  didWin: boolean;
  score: number;
  onRestart: () => void;
}) {
  return (
    <div className={styles.resultOverlay} role="dialog" aria-modal="true">
      <div className={styles.resultPanel}>
        <h3 className="text-2xl font-bold text-neutral-950">
          {didWin ? "성공!" : "실패"}
        </h3>
        <p className="mt-2 text-sm text-neutral-600">
          최종 점수 {score.toLocaleString()}점
        </p>
        <Button type="button" className="mt-5" onClick={onRestart}>
          <RotateCcw aria-hidden="true" />
          다시 시작
        </Button>
      </div>
    </div>
  );
}

function createBoardStyle(rows: number, columns: number): CSSVars {
  return {
    "--rows": rows,
    "--columns": columns,
  };
}

function createTileStyle(
  position: Position,
  rows: number,
  columns: number,
  dragPreview: DragPreview | null,
  generatedOffset: GeneratedTileOffset | null,
  tileId: string,
): CSSVars {
  const isDragging = dragPreview?.tileId === tileId;

  return {
    ...createPositionStyle(position, rows, columns),
    "--drag-x": isDragging ? `${dragPreview.dx}px` : "0px",
    "--drag-y": isDragging ? `${dragPreview.dy}px` : "0px",
    "--generated-offset-x": generatedOffset
      ? `${generatedOffset.columnOffset * 100}%`
      : "0%",
    "--generated-offset-y": generatedOffset
      ? `${generatedOffset.rowOffset * 100}%`
      : "-100%",
  };
}

function createPositionStyle(
  position: Position,
  rows: number,
  columns: number,
): CSSVars {
  return {
    left: `${(position.column / columns) * 100}%`,
    top: `${(position.row / rows) * 100}%`,
    width: `${100 / columns}%`,
    height: `${100 / rows}%`,
  };
}

function createScorePopStyle(
  scorePop: ScorePop,
  rows: number,
  columns: number,
): CSSVars {
  return {
    left: `${((scorePop.position.column + 0.5) / columns) * 100}%`,
    top: `${((scorePop.position.row + 0.5) / rows) * 100}%`,
  };
}
