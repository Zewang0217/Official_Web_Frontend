import fs from 'fs';
import path from 'path';

const read = (file: string) => fs.readFileSync(path.join(__dirname, file), 'utf8');

describe('简历审核页 UI 回归', () => {
  test('保留人工与 AI 初筛能力，但不恢复打分舞台', () => {
    const list = read('ResumeList.tsx');
    const detail = read('ResumeDetail.tsx');
    const page = read('index.tsx');

    expect(list).toContain('全选本页');
    expect(list).toContain('const [picked, setPicked]');
    expect(list).not.toContain('打分舞台');
    expect(detail).not.toContain('打分舞台');
    expect(page).not.toContain('ScoringStage');

    // 每张卡片仍可单独选择一份或多份，随后启动 AI 初筛。
    expect(list).toContain('className="resume-card-select"');
    expect(list).toContain('启动 AI 初筛');
  });

  test('AI 结果嵌入简历审核，不恢复独立简历评估菜单', () => {
    const layout = read('../AdminLayout/index.tsx');
    const detail = read('ResumeDetail.tsx');
    const router = read('../../router/admin.tsx');

    expect(layout).not.toContain('key: "/evaluation-review"');
    expect(router).not.toContain('path: "evaluation-review"');
    expect(detail).toContain('<ResumeAiSummary');
  });
});
